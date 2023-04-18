import './Payment.css';
import DaumPostcode from 'react-daum-postcode';
import { useLocation } from 'react-router-dom';
import Header from '../../../component/Header';
import Button from '../../../component/Button';
import InputGroup from '../../../component/InputGroup';
import Checkbox from '../../../component/Checkbox';
import liberty52 from '../../../image/icon/liberty52.jpg';
import { useState, useEffect } from 'react';

function PaymentSection(props) {
  const deliveryInfo = props.deliveryInfo;
  const [address, setAddress] = useState({
    address1: deliveryInfo.address1,
    zipCode: deliveryInfo.zipCode,
  });
  const [visible, setVisible] = useState(false); // 주소 검색창 (react daum postcoded)
  const paymentItems = [
    {
      type: 'text',
      name: 'receiverName',
      required: true,
      maxLength: 25,
      value: deliveryInfo.receiverName,
    },
    {
      type: 'text',
      name: 'address',
      required: true,
      value: address.address1
        ? address.address1 + ' (' + address.zipCode + ')'
        : '',
      onClick: () => setVisible(true),
      readOnly: true,
    },
    {
      type: 'text',
      name: 'address2',
      required: true,
      value: deliveryInfo.address2,
    },
  ];

  const contactItems = [
    {
      type: 'email',
      name: 'receiverEmail',
      required: true,
      value: deliveryInfo.receiverEmail,
    },
    {
      type: 'text',
      name: 'receiverPhoneNumber',
      required: true,
      pattern: '01[0,1][0-9]{6,8}',
      maxLength: 11,
      title: 'ex) 01012341234',
      value: deliveryInfo.receiverPhoneNumber,
    },
  ];

  return (
    <div className="payment-section">
      <form
        onSubmit={e => {
          e.preventDefault();
          props.setSection('confirm');
          props.setDeliveryInfo({
            receiverName: e.target.receiverName.value,
            address1: address.address1,
            address2: e.target.address2.value,
            receiverEmail: e.target.receiverEmail.value,
            zipCode: address.zipCode,
            receiverPhoneNumber: e.target.checkbox.checked
              ? ''
              : e.target.receiverPhoneNumber.value,
          });
        }}
      >
        <div className="payment-title">
          어디로 주문하신 제품이 배송되길 원하십니까?
        </div>
        <div className="payment-user">
          <div>이름 및 주소 입력:</div>
          {/* 모달로 구현 */}
          <div style={{ display: visible ? 'block' : 'none' }}>
            <Button
              type="button"
              text="닫기"
              onClick={() => setVisible(false)}
            />
            <DaumPostcode
              onComplete={data => {
                setAddress({
                  address1: data.address,
                  zipCode: data.zonecode,
                });
                setVisible(false);
              }}
              autoClose={false}
            />
          </div>
          <InputGroup inputItems={paymentItems} />
        </div>
        <div className="payment-contact">
          <div>연락처 정보:</div>
          <InputGroup inputItems={contactItems} />
          <Checkbox
            text="휴대폰 번호가 없습니다."
            onChange={e => {
              const input = document.querySelector('#receiverPhoneNumber');
              input.disabled = e.target.checked;
              input.required = !e.target.checked;
            }}
          />
        </div>
        <Button text="결제 페이지로 이동" />
      </form>
    </div>
  );
}

function Product(props) {
  const productInfo = props.productInfo;
  return (
    <div className="confirm-product">
      <img src={liberty52} />
      <div>
        <div className="title">Liberty 52_Frame</div>
        <div>
          <div>{productInfo.mounting_method}</div>
          <div>{productInfo.basic_material}</div>
          <div>{productInfo.add_material}</div>
          <div>{productInfo.quantity}개</div>
        </div>
      </div>
      <span>&#8361;{1550000 * productInfo.quantity}</span>
    </div>
  );
}

function BackgroundImage(props) {
  return (
    <div className="confirm-backgroundImage">
      <div className="title">배경이미지 시안</div>
      <img src={props.add_image} />
    </div>
  );
}

function DeliveryInfo(props) {
  return (
    <div className="confirm-info">
      <div className="title">배송 상세 정보</div>
      <div className="content">
        <div>
          <div>배송지: </div>
          <div>
            ({props.deliveryInfo.zipCode}) {props.deliveryInfo.address1}{' '}
          </div>
          <div>{props.deliveryInfo.address2}</div>
        </div>
        <div>
          <div>연락처 정보:</div>
          <div>{props.deliveryInfo.receiverEmail}</div>
          <div>{props.deliveryInfo.receiverPhoneNumber}</div>
        </div>
      </div>
    </div>
  );
}

function PaymentInfo() {
  return (
    <div className="confirm-info">
      <div className="title">결제 상세 정보</div>
      <div className="content">
        <span>-</span>
      </div>
    </div>
  );
}

function TermsOfUse() {
  return (
    <div className="confirm-termsOfUse">
      <div className="title">이용 약관</div>
      <div className="content">
        <Checkbox
          text={
            <div>
              <a href="">Liberty 개인정보 취급방침</a>
              <span>
                에 따라 개인정보를 수집하고, 사용하고, 제3자에 제공하고,
                처리한다는 점에 동의합니다.
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
}

function Total(props) {
  return (
    <div className="confirm-total">
      <div className="title">총계</div>
      <div className="contents">
        <div className="content">
          <span>소계</span>
          <span>&#8361;{1550000 * props.quantity}</span>
        </div>
        <div className="content">
          <span>배송</span>
          <span>무료</span>
        </div>
        <div className="content">
          <span>총계</span>
          <span>&#8361;{1550000 * props.quantity}</span>
        </div>
      </div>
    </div>
  );
}

function ConfirmSection(props) {
  return (
    <div className="confirm-section">
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <div className="payment-title">
          입력하신 사항이 모두 정확한지 확인해주십시오.
        </div>
        <Product productInfo={props.productInfo} />
        <BackgroundImage add_image={props.productInfo.add_image} />
        <DeliveryInfo deliveryInfo={props.deliveryInfo} />
        <PaymentInfo />
        <TermsOfUse />
        <Total quantity={props.productInfo.quantity} />
        <Button text="결제하기" />
        <Button
          text="돌아가기"
          onClick={e => {
            e.preventDefault();
            props.setSection('form');
          }}
        />
      </form>
    </div>
  );
}

export default function Payment() {
  const location = useLocation();
  const productInfo = { ...location.state };

  const [section, setSection] = useState('form');
  const [deliveryInfo, setDeliveryInfo] = useState({
    receiverName: '',
    address1: '',
    address2: '',
    zipCode: '',
    receiverEmail: '',
    receiverPhoneNumber: '',
  });
  return (
    <div className="payment">
      <Header />
      {section === 'form' ? (
        <PaymentSection
          setSection={setSection}
          deliveryInfo={deliveryInfo}
          setDeliveryInfo={setDeliveryInfo}
        />
      ) : (
        <ConfirmSection
          setSection={setSection}
          productInfo={productInfo}
          deliveryInfo={deliveryInfo}
        />
      )}
    </div>
  );
}
