const models = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

//테이블 변경으로 (id pk 추가) 해당 메소드는 사용 안함
const upsertDictionary = async (data) => {
  try {
    const result = await models.Dictionary.upsert(data, {
      returning: true, // 업데이트된 데이터를 반환받기 위해 추가
    });
    return result; // [result: Instance, created: boolean]
  } catch (error) {
    console.error("Error in upsertWord service:", error);
    throw new Error("Database upsert operation failed");
  }
};

//말입력 신규
const createDictionary = async (data) => {
  try {
    console.log("dictionaryDao.js 21 라인 >>>>>>>>>>>>", data);
    return await models.Dictionary.create(data);
  } catch (error) {
    console.log(">>>>>>> Error insert word : ", error);
    throw new Error("Database insert operation failed");
  }
};

//말입력 수정
const updateDictionary = async (id, data) => {
  try {
    console.log("전송된 id >>>>>>>>>>>>>>>", data);
    console.log("전송된 수정 data>>>>>>>>>", data);
    return await models.Dictionary.update(data, {
      where: { id },
    });
  } catch (error) {
    console.log(">>>>>>> Error update word", error);
    throw error;
  }
};

//말입력 조회
const findWordByEmail = async (email, word) => {
  try {
    const trimedWord = word.trim(); // word에 TRIM 적용
    const dictionary = await models.Dictionary.findOne({
      // return await models.Dictionary.findOne({
      where: {
        email: email,
        word: trimedWord,
      },
    });
    console.log(">>>>>>> findWordByEmail >>>>>>>", dictionary);
    return dictionary;
  } catch (error) {
    console.log(">>>>>>> Error fetching data by word", error);
    throw error;
  }
};

//말입력 ID로 조회
const findWordById = async (id) => {
  try {
    const dictionary = await models.Dictionary.findOne({
      // return await models.Dictionary.findOne({
      where: {
        id: id,
      },
    });
    console.log(">>>>>>> findWordById >>>>>>>", dictionary);
    return dictionary;
  } catch (error) {
    console.log(">>>>>>> Error fetching data by id", error);
    throw error;
  }
};

//말입력 콤보박스 조회
const findlikeWordByEmail = async (email, word) => {
  try {
    const trimedWord = word.trim(); // word에 TRIM 적용
    const words = await models.Dictionary.findAll({
      attributes: ["id", "word"],
      where: {
        email: email,
        word: { [Op.like]: `%${trimedWord}%` },
      },
    });
    console.log(">>>>>>> findlikeWordByEmail >>>>>>>", words);
    return words;
  } catch (error) {
    console.log(">>>>>>> Error fetching data by word", error);
    throw error;
  }
};

//사전 화면을 위한 각 개인의 카테고리별 단어 전체 조회
const findAllbyCategory = async (email, c_id) => {
  try {
    return await models.Dictionary.findAll({
      attributes: [
        [Sequelize.literal("ROW_NUMBER() OVER (ORDER BY id DESC)"), "rowNum"],
        "id",
        "word",
        [
          Sequelize.literal("TO_CHAR(c_date, 'YYYY-MM-DD HH24:MI:SS')"),
          "c_date",
        ],
        "memo",
        "level",
        "des",
      ],
      where: {
        email: email,
        c_id: c_id,
      },
    });
  } catch (error) {
    console.log(">>>>>>> Error fetching datas by category", error);
    throw error;
  }
};

const deleteDictionary = async (id) => {
  try {
    return await models.Dictionary.destroy({
      where: { id },
    });
  } catch (error) {
    console.log("Error delete data by word", error);
    throw error;
  }
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
