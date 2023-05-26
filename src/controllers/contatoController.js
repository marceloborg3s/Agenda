const Contato = require('../models/ContatoModel')

exports.index = (req, res) => {
  return res.render('contato', { contato: {} })
}

exports.register = async (req, res) => {
  try{
    const contato = new Contato(req.body);
    await contato.register();

    if(contato.errors.length > 0){
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('/contato/'));
      return;
    }

    req.flash('success', 'Contato registrado com sucesso');
    req.session.save(() => res.redirect(`/contato/${contato.contato._id}`));
    return;
  } catch(e) {
    console.log(e)
    return res.render('404')
  }
};

exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const contato = await Contato.buscaPorID(req.params.id);
  if(!contato) return res.render('404');

  res.render('contato', {contato});
  // res.render('contato', {
  //   contato: contato,
  // });
}