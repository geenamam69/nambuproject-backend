const dictionaryDao = require("../dao/dictionaryDao");

const upsertDictionary = async (data) => {
  return await dictionaryDao.upsertDictionary(data);
};

const createDictionary = async (data) => {
  return await dictionaryDao.createDictionary(data);
};

const updateDictionary = async (id, data) => {
  return await dictionaryDao.updateDictionary(id, data);
};

const findWordByEmail = async (email, word) => {
  try {
    return await dictionaryDao.findWordByEmail(email, word);
  } catch (error) {
    console.error("fetchWordByEmail 오류:", error.message);
  }
};

const findWordById = async (id) => {
  try {
    return await dictionaryDao.findWordById(id);
  } catch (error) {
    console.error("fetchWordById 오류:", error.message);
  }
};

//말입력 콤보박스를 위한 조회
const findlikeWordByEmail = async (email, word) => {
  try {
    const words = await dictionaryDao.findlikeWordByEmail(email, word);
    console.log(
      ">>>>>>>>>> Service 26라인 입력단어로 like fetch 한 단어들",
      words
    );
    return words;
  } catch (error) {
    console.error("findlikeWordByEmail 오류:", error.message);
  }
};

const findAllbyCategory = async (email, c_id) => {
  return await dictionaryDao.findAllbyCategory(email, c_id);
};

const deleteDictionary = async (id) => {
  return await dictionaryDao.deleteDictionary(id);
};

module.exports = {
  upsertDictionary,
  createDictionary,
  updateDictionary,
  findWordByEmail,
  findWordById,
  findlikeWordByEmail,
  findAllbyCategory,
  deleteDictionary,
};
