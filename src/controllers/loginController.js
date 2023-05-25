const Login = require('../models/LoginModel')

exports.index = (req, res) => {
  if(req.session.user) return res.render('login-logado')
  console.log(req.session.user)
  return res.render('login');
};

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.register();
  
    if(login.errors.length > 0) {
      req.flash('errors', login.errors);
      // req.session.save(function() {
      //   return res.redirect('/login/');
      // });
      await req.session.save();
      return res.redirect('/login/');
    };

    req.flash('success', 'Seu usário foi criado com sucesso.');
    // req.session.save(function() {
    //   return res.redirect('/login/');
    // });

    await req.session.save();
    return res.redirect('/login/');

    // return res.send(login.user);
  } catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.login = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.login();
  
    if(login.errors.length > 0) {
      req.flash('errors', login.errors);
      await req.session.save();
      return res.redirect('/login/');
    };

    req.flash('success', 'Você entrou no sistema.');
    req.session.user = login.user;

    await req.session.save();
    return res.redirect('/login/');

  } catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/login');
  });
};
