// import React, { useEffect } from "react";
// import { listSubOrders } from "../store/actions/orderActions";
// import { useDispatch, useSelector } from "react-redux";
// import { myDetails } from "../store/actions/userActions";
// import { Button, Col, Row, Table } from "react-bootstrap";
// import Loader from "../components/Loader";
// import Message from "../components/Message";
// import { LinkContainer } from "react-router-bootstrap";

// export default function MyOrders() {
//   const dispatch = useDispatch();
//   const {
//     suborders,
//     loading: loadingSuborders,
//     error: errorSuborders,
//   } = useSelector((state) => state.subOrderList);
//   const { user } = useSelector((state) => state.myDetails);

//   const result = suborders?.filter((suborder) => {
//     return suborder.seller.profile.name === user.profile.name;
//   });

//   console.log(result);

//   useEffect(() => {
//     dispatch(listSubOrders());
//     dispatch(myDetails());
//   }, [dispatch]);

//   return (
//     <Row className="justify-content-center">
//       <Col md={9}>
//         <h2 className="text-center my-3" style={{ color: "#1e478a" }}>
//           My Orders
//         </h2>
//         {loadingSuborders ? (
//           <Loader />
//         ) : errorSuborders ? (
//           <Message variant="danger">{errorSuborders}</Message>
//         ) : suborders.length === 0 ? (
//           <h2 className="text-center">No suborders were found.</h2>
//         ) : (
//           <Table striped responsive className="table-sm">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Date</th>
//                 <th>Total</th>
//                 <th>Buyer</th>
//                 <th>Paid</th>
//                 <th>Delivered</th>
//                 <th></th>
//               </tr>
//             </thead>

//             <tbody>
//               {result.map((suborder) => (
//                 <tr key={suborder.id}>
//                   <td>{suborder.id}</td>
//                   <td>{suborder.createdAt.substring(0, 10)}</td>
//                   <td>CHF {suborder.totalPrice}</td>
//                   <td>{suborder.customer_details.profile.name}</td>
//                   <td>
//                     {suborder.isPaid ? (
//                       suborder.paidAt.substring(0, 10)
//                     ) : (
//                       <i className="fas fa-times" style={{ color: "red" }}></i>
//                     )}
//                   </td>
//                   <td>
//                     {suborder.isDelivered ? (
//                       suborder.deliveredAt.substring(0, 10)
//                     ) : (
//                       <i className="fas fa-times" style={{ color: "red" }}></i>
//                     )}
//                   </td>
//                   <td>
//                     <LinkContainer to={`/suborder/${suborder.id}`}>
//                       <Button className="btn-sm">Details</Button>
//                     </LinkContainer>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         )}
//       </Col>
//     </Row>
//   );
// }
