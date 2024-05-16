export default (error, req, res, next) => {
  if (error.isJoi) {
    const errorMessage = error.details.map((detail) => {
      switch (detail.context.key) {
        case 'name':
          return '상품명을 입력해주세요.';
        case 'description':
          return '상품 설명을 입력해주세요.';
        case 'manager':
          return '담당자를 입력해주세요.';
        case 'password':
          return '비밀번호를 입력해주세요.';
        case 'productsId':
          return '올바르지 않은 상품 id입니다.';
        default:
          return detail.message;
      }
    });
    return res.status(400).json({ errorMessage: errorMessage });
  }
  if (error.code === 11000) {
    return res.status(400).json({ errorMessage: '이미 등록 된 상품입니다.' });
  }
  return res.status(500).json({
    errorMessage: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
  });
};
