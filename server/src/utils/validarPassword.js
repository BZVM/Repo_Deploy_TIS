function validarPassword(password) {
  const errores = [];
  if (password.length < 10) errores.push("mínimo 10 caracteres");
  if (!/[A-Z]/.test(password)) errores.push("al menos una mayúscula");
  if (!/[a-z]/.test(password)) errores.push("al menos una minúscula");
  if (!/[0-9]/.test(password)) errores.push("al menos un número");
  if (!/[^A-Za-z0-9]/.test(password)) errores.push("al menos un carácter especial");
  return errores;
}

module.exports = { validarPassword };
