// Table payment_receipt_idx_associated_user {
//     user_id varchar [pk]
//     idx int [pk]
//   }

const admin = require("firebase-admin");
const db = admin.firestore();

module.exports = {
  
  // payment_receipt_idx_associated_user 데이터를 생성하는 함수

  async create(datas) {
    // 접근 db table name : payment_receipt_idx_associated_user
    // payment_receipt_idx_associated_user db table column : user_id[pk], idx[pk]

    const user_id = datas.user_id;
    const payment_receipt_idx = datas.payment_receipt_idx;

    const fieldData = {
        user_id: user_id,
        payment_receipt_idx: payment_receipt_idx,
    }
    try {
      // 컬렉션에 새로운 문서 생성
      const docName = `${user_id}_${payment_receipt_idx}`
      await db.collection("payment_receipt_idx_associated_user")
      .doc(docName).set(fieldData);
      return 1; // 성공
    } catch (error) {
      console.error("payment_receipt_idx_associated_user 데이터 생성(create) 실패:", error);
      return -1; // 실패
    }
  },
  
  
  // payment_receipt_idx_associated_user에서 user_id가 관련된 payment_receipt_idx를 읽어오는 함수
  async read(datas) {
    // 접근 db table name : payment_receipt_idx_associated_user
    // payment_receipt_idx_associated_user db table column : user_id[pk], idx[pk]

    const user_id = datas.user_id;

    // try {
    //     const sellersChosenMainBlockchainRef = db.collection('sellers_chosen_main_blockchain');
    
    //     const querySnapshot = await sellersChosenMainBlockchainRef.get();
    
    //     const mainBlockchainIdxList = [];
    //     querySnapshot.forEach((doc) => {
    //       const docName = doc.id;
    //       const sellerIdFromDoc = docName.split('_')[0];
    //       const mainBlockchainIdx = docName.split('_')[2];
    //       const mainBlockchainIdxOnly = mainBlockchainIdx.split('x')[1];
          
    //       if (sellerIdFromDoc === sellerId) {
    //         mainBlockchainIdxList.push(mainBlockchainIdxOnly);
    //       }
    //     });
    
    //     return mainBlockchainIdxList; // seller가 선택한 메인 블록체인의 인덱스 리스트 리턴
    //   } catch (error) {
    //     console.error('데이터 읽기 실패:', error);
    //     return null;
    //   }

      try {
        const paymentReciptIdxAssociatedUserRef = db.collection('payment_receipt_idx_associated_user');
    
        const querySnapshot = await paymentReciptIdxAssociatedUserRef.get();
    
        const IdxAssociatedUserList = [];
        querySnapshot.forEach((doc) => {
          const docName = doc.id;
          const userIdFromDoc = docName.split('_')[0];
          const paymentReceiptIdx = docName.split('_')[1];
          
          if (userIdFromDoc === user_id) {
            IdxAssociatedUserList.push(paymentReceiptIdx);
          }
        });
    
        return IdxAssociatedUserList; // user가 관련된 payment_receipt_idx 리스트 리턴
      } catch (error) {
        console.error('payment_receipt_idx_associated_user 데이터 읽기(read) 실패:', error);
        return null;
      }
    },
  
  // 복합키라서 수정은 안됨 삭제해야함
  
  // payment_receipt_idx_associated_user 데이터를 삭제하는 함수
  async delete(datas) {
    // 접근 db table name : payment_receipt_idx_associated_user
    // payment_receipt_idx_associated_user db table column : user_id[pk], idx[pk]

    const user_id = datas.user_id;
    const payment_receipt_idx = datas.payment_receipt_idx;

    try {
      const docName = `${user_id}_${payment_receipt_idx}`;
      const docRef = db.collection("payment_receipt_idx_associated_user").doc(docName);
      const doc = await docRef.get();
  
      if (doc.exists) {
          await docRef.delete();
          return 1; // 성공
        } else {
          console.log("문서가 존재하지 않습니다.");
          return -1; // 실패
        }
    } catch (error) {
      console.error('데이터 삭제 실패:', error);
      return -1; // 실패
    }
  }

}
