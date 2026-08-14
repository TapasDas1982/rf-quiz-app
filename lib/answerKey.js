// SERVER ONLY. Never import this file from a client component or a file that
// lib/questions.js's consumers also import; it must only be reachable from
// app/api/submit/route.js and app/admin/[id]/page.js so answers never reach
// the browser bundle.
// Maps question id -> index (0 based) of the correct option.
const answerKey = {
  // nutrition
  nut1: 0, nut2: 2, nut3: 2, nut4: 2, nut5: 1, nut6: 0,
  nut7: 1, nut8: 0, nut9: 1, nut10: 0, nut11: 0, nut12: 1,
  nut13: 0, nut14: 2, nut15: 2, nut16: 2, nut17: 1, nut18: 1,
  nut19: 0, nut20: 1, nut21: 1, nut22: 0, nut23: 1, nut24: 1,
  nut25: 0, nut26: 1, nut27: 1, nut28: 0, nut29: 0, nut30: 1,
  nut31: 1, nut32: 0, nut33: 1, nut34: 1, nut35: 1, nut36: 0,
  nut37: 0, nut38: 1, nut39: 1, nut40: 1,
  // lifestyle
  lif1: 1, lif2: 1, lif3: 0, lif4: 1, lif5: 0, lif6: 1,
  lif7: 0, lif8: 1, lif9: 0, lif10: 0, lif11: 1, lif12: 1,
  lif13: 2, lif14: 0, lif15: 1, lif16: 1, lif17: 1, lif18: 1,
  lif19: 1, lif20: 1, lif21: 1, lif22: 1, lif23: 1, lif24: 1,
  lif25: 1, lif26: 1, lif27: 1, lif28: 1, lif29: 1, lif30: 1,
  lif31: 1, lif32: 1, lif33: 1, lif34: 1, lif35: 1, lif36: 1,
  lif37: 1, lif38: 1, lif39: 1, lif40: 1,
  // mindset
  min1: 2, min2: 1, min3: 1, min4: 1, min5: 0, min6: 0,
  min7: 0, min8: 0, min9: 0, min10: 0, min11: 0, min12: 0,
  min13: 1, min14: 2, min15: 0, min16: 1, min17: 0, min18: 0,
  min19: 0, min20: 1, min21: 0, min22: 0, min23: 0, min24: 0,
  min25: 0, min26: 0, min27: 0, min28: 0, min29: 0, min30: 0,
  min31: 0, min32: 0, min33: 0, min34: 0, min35: 0, min36: 0,
  min37: 0, min38: 0, min39: 0, min40: 0,
  // medical
  med1: 2, med2: 0, med3: 1, med4: 1, med5: 0, med6: 0,
  med7: 0, med8: 0, med9: 0, med10: 0, med11: 0, med12: 0,
  med13: 1, med14: 1, med15: 1, med16: 1, med17: 1, med18: 0,
  med19: 1, med20: 0, med21: 1, med22: 1, med23: 1, med24: 1,
  med25: 1, med26: 1, med27: 0, med28: 0, med29: 0, med30: 0,
  med31: 0, med32: 0, med33: 0, med34: 0, med35: 0, med36: 0,
  med37: 0, med38: 0, med39: 0, med40: 0, med41: 1, med42: 1,
  med43: 2,
  // programs
  pro1: 1, pro2: 1, pro3: 2, pro4: 0, pro5: 0, pro6: 0,
  pro7: 0, pro8: 0, pro9: 0, pro10: 0, pro11: 0, pro12: 0,
  pro13: 0, pro14: 0, pro15: 0, pro16: 0, pro17: 0, pro18: 0,
  pro19: 0, pro20: 0, pro21: 0, pro22: 0, pro23: 0, pro24: 0,
  pro25: 0, pro26: 0, pro27: 0, pro28: 0, pro29: 0, pro30: 0,
  pro31: 0, pro32: 0, pro33: 0, pro34: 0, pro35: 0, pro36: 0,
  pro37: 0,
};

module.exports = { answerKey };
