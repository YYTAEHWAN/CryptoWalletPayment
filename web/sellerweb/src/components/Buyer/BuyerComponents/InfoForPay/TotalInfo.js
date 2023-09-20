import classes from "./TotalInfo.module.css";
import { Link } from "react-router-dom";

const TotalInfo = (props) => {
  return (
    <div className={classes.totalinfo}>
      <div className={classes.totalprice}>
        <h1>총 결제금액:</h1>
        <h1>10000원</h1>
      </div>
      <Link to="/" className={classes.link}>
        <button className={classes.button} onClick={props.onShowModal}>
          결제하기
        </button>
      </Link>
    </div>
  );
};

export default TotalInfo;
