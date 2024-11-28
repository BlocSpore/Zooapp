const bcrypt = require('bcrypt');

const passwordToHash = 'Lapatate.12'; // Remplacez par le mot de passe que vous souhaitez utiliser

bcrypt.hash(passwordToHash, 10, (err, hash) => {
  if (err) {
    console.error('Erreur lors du hachage du mot de passe :', err);
  } else {
    console.log('Mot de passe haché :', hash);
  }
});
