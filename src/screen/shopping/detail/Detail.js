import './Detail.css';
import React, { useState, useEffect } from 'react';
import Header from '../../../component/Header';
import Footer from '../../../component/Footer';
import { useParams, useLocation } from 'react-router-dom';
import axios from '../../../axios/axios';
import { ACCESS_TOKEN } from "../../../constants/token";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function InquiryDetails() {
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const accessToken = localStorage.getItem('ACCESS_TOKEN');
  const query = useQuery();
  const phoneNumber = query.get('phoneNumber');


    useEffect(() => {
      const getAccessToken = () => {
        return sessionStorage.getItem('ACCESS_TOKEN');
      };

      const fetchOrderDetails = async (orderId, accessToken) => {
        try {
          const response = await axios.get(`/product/orders/${orderId}`, {
            headers: {
              Authorization: ` ${accessToken}`,
            },
          });
          setOrderDetails(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      };

      const fetchGuestOrderDetails = async (orderId, phoneNumber) => {

        try {
          const response = await axios.get(`/product/guest/orders/${orderId}`, {
            headers: {
              Authorization: ` ${phoneNumber}`,
            },
          });
          setOrderDetails(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      };

      const accessToken = getAccessToken();
      if (accessToken) {
        fetchOrderDetails(orderId, accessToken);
      } else {
        if (phoneNumber) {
          fetchGuestOrderDetails(orderId, phoneNumber);
        } else {
          const enteredPhoneNumber = prompt('휴대폰 번호를 입력해주세요.');
          fetchGuestOrderDetails(orderId, enteredPhoneNumber);
        }
      }
    }, [orderId, phoneNumber]);
    if (loading) {
      return <div>Loading...</div>;
    }

    function OrderDetailsSection({ orderDetails }) {
      return (
        <>
          <div className="Text1">{orderDetails.orderNum}</div>
          <div className="section1">
            <ul className="Detailul">
              {orderDetails.products.map(product => (
                <li key={product.name} className="DetailProduct">
                  <img
                    src={product.productUrl}
                    alt={product.name}
                    className="productRepresentUrl"
                  />
                  <p className="DetailProductName">{product.name}</p>
                  <p className="DetailProductOptions">
                    {product.options.map(option => (
                      <p key={option}>{option}</p>
                    ))}
                  </p>
                  <p className="DetailProductQuantity">{product.quantity} 개</p>
                  <p className="DetailProductPrice">
                    ₩{product.price.toLocaleString()}
                  </p>

                </li>

              ))}
            </ul>
          </div>
        </>
      );
    }



    function ImgDetailsSection({ orderDetails }) {
      return (
        <div className="section2">
          <p className="DetailCName">배경이미지 시안</p>
          <img src={orderDetails.productRepresentUrl} alt="배경이미지 시안" />
        </div>
      );
    }
    function DeliveryDetailsSection({ orderDetails }) {
      return (
        <div className="section3">
          <p className="DetailCName">배송 상세 정보</p>
          <p className="DetailSpacing">
            <div>배송지: </div>
            <div>{orderDetails.address}</div>
           </p>
          <p className="DetailSpacing">
            <div>연락처 정보: </div>
            <div>{orderDetails.receiverEmail}</div>
            <div>{orderDetails.receiverPhoneNumber}</div>
            <div>{orderDetails.receiverName}</div>
          </p>
        </div>
      );
    }

    function PaymentDetailsSection({ orderDetails }) {
      const { paymentType, paymentInfo } = orderDetails;
      const cardInfo = `${paymentInfo.cardName} **** **** **** ${paymentInfo.cardNumber.substr(-4)}`;

      return (
        <div className="section4">
          <p className="DetailCName">결제 상세 정보</p>
          <p className="DetailSpacing">
            <div>결제 수단: </div>
            <div>{paymentType}: {cardInfo}</div>
            <div>{orderDetails.orderDate}</div>
          </p>
          <p className="DetailSpacing">
            <div>청구 주소: </div>
            <div>{orderDetails.address}</div>
          </p>
        </div>
      );
    }

    function ResultDetailsSection({ orderDetails }) {
      return (
          <div className="section5">
            <p className="DetailCName">총계</p>
            <div className="finalWrapper">
              <div className="FinalTop">
                <p className="charge">
                  <div>소계</div>
                  <div>₩{orderDetails.totalProductPrice.toLocaleString()}</div>
                </p>
                <p className="delivery">
                  <div>배송비</div>
                  <div>₩{orderDetails.deliveryFee.toLocaleString()}</div>
                </p>
              </div>
              <div className="FinalBottom">
                <p className="finalDetail">
                  <div>총계</div>
                  <div>₩{orderDetails.totalPrice.toLocaleString()}</div>
                </p>
              </div>
            </div>
          </div>
      );
    }


  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <OrderDetailsSection orderDetails={orderDetails} />
          <ImgDetailsSection orderDetails={orderDetails} />
          <DeliveryDetailsSection orderDetails={orderDetails} />
          <PaymentDetailsSection orderDetails={orderDetails} />
          <ResultDetailsSection orderDetails={orderDetails} />
        </>
      )}
    </div>
  );
}

export default function Detail() {
  return (
    <>
      <Header/>
      <div className="container">
        <InquiryDetails/>
      </div>
      <Footer/>
    </>
  );
}
