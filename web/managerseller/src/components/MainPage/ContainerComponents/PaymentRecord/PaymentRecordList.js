import classes from "./PaymentRecordList.module.css";

import PaymentRecord from "./PaymentRecord";

const PaymentRecordList = ({ records }) => {
  return (
    <ul className={classes.table}>
      <table className={classes.table_wrap}>
        <thead>
          <tr>
            <th className={classes.table_th}>consumer_id</th>
            <th className={classes.table_th}>payment_wallet_name</th>
            <th className={classes.table_th}>detailed_network_name</th>
            <th className={classes.table_th}>main_blockchain_name</th>
            <th className={classes.table_th}>price_total</th>
            <th className={classes.table_th}>payment_start_time</th>
            <th className={classes.table_th}>payment_end_time</th>
            <th className={classes.table_th}>payment_status</th>
          </tr>
        </thead>
        {records.map((record, index) => (
          <>
            <PaymentRecord key={index} className={classes.table_row}
              networkInfoData={record.networkInfoData}
              participantsData={record.participantsData}
              productsAllData={record.productsAllData}
              statusInfoData={record.statusInfoData}
            />
          </>

        ))}
      </table>
    </ul>
  );
};

export default PaymentRecordList;
