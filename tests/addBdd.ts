import t from '../src/functions/addBdd';

(async() => {
  const c = await t(
    "a",
    "clips",
    "a",
    "a",
    "a",
    "a",
  );
  console.log(c);
})();