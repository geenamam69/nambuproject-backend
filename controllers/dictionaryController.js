const dictionaryService = require("../services/dictionaryService");

const postTypeBranch = (req, res) => {
  const { type } = req.params; // 경로 매개변수 "type" 추출
  console.log("Controller postTypeBranch type = ", type);
  switch (type) {
    case "1":
      findWordById(req, res);
      break;

    case "2":
      findAllbyCategory(req, res);
      break;

    case "3":
      createDictionary(req, res);
      break;

    case "4":
      findlikeWordByEmail(req, res);
      break;

    case "5":
      updateDictionary(req, res);
      break;

    case "6":
      findWordByEmail(req, res);
      break;

    default:
      console.log("입력된 Type 값이 올바르지 않습니다.");
      break;
  }
};

const upsertDictionary = async (req, res) => {
  const { word, des, des_json, c_id, memo, url, input_type } = req.body;
  const email = req.user.email;

  if (!word || !email) {
    return res.status(400).json({
      message: "서버에 등록/수정할 Word & Email 항목값이 전달 안됨.",
      data: `word=${word}, email=${email}`,
    });
  }

  try {
    const [result, created] = await dictionaryService.upsertDictionary({
      email,
      word,
      des,
      des_json,
      c_id,
      memo,
      url,
      input_type,
    });

    if (created) {
      return res.status(201).json({
        message: "단어정보 등록이 성공적으로 완료되었습니다.",
        data: word,
      });
    }
    return res.status(200).json({
      message: "단어정보 수정이 성공적으로 왼료되었습니다.",
      data: word,
    });
  } catch (e) {
    return res.status(500).json({
      message: "단어정보 등록/수정중 오류가 발생하였습니다.",
      data: e.message,
    });
  }
};

//등록
const createDictionary = async (req, res) => {
  const { word, des, des_json, c_id, memo, url, input_type } = req.body;
  const email = req.user.email;

  if (!word || !email) {
    return res.status(400).json({
      message: "서버에 등록할 Word & Email 항목값이 전달 안됨.",
      data: `word=${word}, email=${email}`,
    });
  }

  try {
    const dictionary = await dictionaryService.createDictionary({
      email: email,
      word: word,
      des: des,
      des_json: des_json,
      c_id: parseInt(c_id),
      memo: memo,
      url: url,
      input_type: parseInt(input_type),
    });
    return res.status(200).json({
      message: "단어정보 등록이 성공적으로 완료되었습니다.",
      data: word,
    });
  } catch (e) {
    console.error("단어정보 등록중 오류가 발생하였습니다. :", e);
    return res.status(500).json({
      message: "단어정보 등록중 오류가 발생하였습니다.",
      data: e.message,
    });
  }
};

//수정
const updateDictionary = async (req, res) => {
  const { id, word, des, c_id, memo, input_type } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "서버에 수정할 데이타의 KEY값이 전달 안됨.",
      data: `id=${id}`,
    });
  }

  try {
    const dictionary = await dictionaryService.updateDictionary(parseInt(id), {
      word: word,
      des: des,
      c_id: parseInt(c_id),
      memo: memo,
      input_type: parseInt(input_type),
    });
    return res.status(200).json({
      message: "단어정보 수정이 성공적으로 왼료되었습니다.",
      data: dictionary,
    });
  } catch (e) {
    console.error("단어정보 수정중 오류가 발생하였습니다. : ", e);
    return res.status(500).json({
      message: "단어정보 수정중 오류가 발생하였습니다.",
      data: e.message,
    });
  }
};

const findWordByEmail = async (req, res) => {
  const { word } = req.body;
  const email = req.user.email;

  if (!word || !email) {
    return res.status(400).json({
      message: "서버에 조회할 Word & Email 항목값이 전달 안됨.",
      data: `word=${word}, email=${email}`,
    });
  }

  try {
    const dictionary = await dictionaryService.findWordByEmail(email, word);

    if (!dictionary) {
      return res.status(404).json({
        message: "조회하는 단어정보가 존재하지 않습니다.",
        data: `email: ${email} and word: ${word}`,
      });
    }
    res.status(200).json({
      message: "단어정보가 성공적으로 조회 되었습니다.",
      data: dictionary,
    });
  } catch (e) {
    console.error("단어정보 조회중 오류가 발생 하였습니다. : ", e);
    res.status(500).json({
      message: "단어정보 조회중 오류가 발생 하였습니다.",
      data: e.message,
    });
  }
};

//Id를 이용한 word 조회
const findWordById = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "서버에 조회할 단어의 KEY가 전달되지 않았습니다.",
      data: `id=${id}`,
    });
  }

  try {
    const dictionary = await dictionaryService.findWordById(id);

    if (!dictionary) {
      return res.status(404).json({
        message: "조회하는 단어정보가 존재하지 않습니다.",
        data: `id=${id}`,
      });
    }
    res.status(200).json({
      message: "단어정보가 성공적으로 조회 되었습니다.",
      data: dictionary,
    });
  } catch (e) {
    console.error("단어정보 조회중 오류가 발생 하였습니다. : ", e);
    res.status(500).json({
      message: "단어정보 조회중 오류가 발생 하였습니다.",
      data: e.message,
    });
  }
};

//콤보박스 조회용
const findlikeWordByEmail = async (req, res) => {
  const { word } = req.body;
  const email = req.user.email;

  if (!word || !email) {
    return res
      .status(400)
      .json({ message: "서버에 조회할 Word & Email 항목값이 전달 안됨." });
  }

  try {
    const words = await dictionaryService.findlikeWordByEmail(email, word);

    if (!words) {
      return res.status(404).json({
        message: `유사 단어정보가 존재하지 않습니다. email: ${email} and word: ${word}`,
      });
    }
    res.status(200).json({
      message: "유사 단어정보가 성공적으로 조회 되었습니다.",
      data: words,
    });
  } catch (e) {
    console.error("유사 단어정보 조회중 오류가 발생하였습니다. :  ", e);
    res.status(500).json({
      message: "유사 단어정보 조회중 오류가 발생하였습니다.",
      error: e.message,
    });
  }
};

const findAllbyCategory = async (req, res) => {
  const { c_id } = req.body;
  const email = req.user.email;

  try {
    const dictionarys = await dictionaryService.findAllbyCategory(email, c_id);
    res.status(200).json({
      message: "선택된 카테고리로 등록된 단어가 성공적으로 조회되었습니다.",
      data: dictionarys,
    });
  } catch (e) {
    res.status(500).json({
      message: "선택된 카테고리로 등록된 단어 조회중 오류가 발생하였습니다.",
      data: e.message,
    });
  }
};

const deleteDictionary = async (req, res) => {
  try {
    const id = req.params.id;
    const word = await dictionaryService.deleteDictionary(id);
    res
      .status(204)
      .json({ message: "선택한 단어가 성공적으로 삭제 되었습니다. " });
  } catch (e) {
    res.status(500).json({
      message: "선택한 단어의 삭제중 오류가 발생하였습니다.",
      data: e.message,
    });
  }
};

module.exports = {
  upsertDictionary,
  createDictionary,
  findWordByEmail,
  findWordById,
  findlikeWordByEmail,
  findAllbyCategory,
  deleteDictionary,
  postTypeBranch,
};
