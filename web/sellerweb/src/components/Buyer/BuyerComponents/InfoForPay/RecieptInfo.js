import classes from "./RecieptInfo.module.css";

const RecieptInfo = () => {
  return (
    <div className={classes.recieptinfo}>
      <h3 className={classes.title}>결제 정보</h3>
      <h3>선택 강의 금액: 20000원 </h3>
      <h3>- 할인 금액: 10000원</h3>
    </div>
  );
};

export default RecieptInfo;
