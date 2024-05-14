export default (error, req, res, next) => {
  if (error.isJoi) {
    return res.status(400).json({ errorMessage: error.message });
  }
  if (error.code === 11000) {
    return res.status(400).json({ errorMessage: '이미 등록 된 상품입니다.' });
  }
  return res.status(500).json({
    errorMessage: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
  });
};
