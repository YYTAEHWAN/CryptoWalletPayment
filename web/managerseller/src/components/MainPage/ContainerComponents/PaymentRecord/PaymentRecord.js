import classes from "./PaymentRecord.module.css";

const PaymentRecord = (props) => {

  let total = 0;

  for (let i = 0; i < props.productsAllData.length; i++) {
    total += Number(props.productsAllData[i].product_won_price_per);
  }
  return (
    <>
      <tbody>
        <tr>
          <td className={classes.table_td}>
            {props.participantsData.consumer_id}
          </td>
          <td className={classes.table_td}>
            {props.networkInfoData.payment_wallet_name}
          </td>
          <td className={classes.table_td}>
            {props.networkInfoData.detailed_network_name}
          </td>
          <td className={classes.table_td}>
            {props.networkInfoData.main_blockchain_name}
          </td>
          <td className={classes.table_td}>{`${total}원`}</td>
          <td className={classes.table_td}>
            {props.statusInfoData.payment_start_time}
          </td>
          <td className={classes.table_td}>
            {props.statusInfoData.payment_end_time}
          </td>
          <td className={classes.table_td}>
            {props.statusInfoData.payment_status}
          </td>
        </tr>
      </tbody>
    </>
  );
};

export default PaymentRecord;
