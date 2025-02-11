import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppContext from '../../hooks/useAppContext';

import Swal from 'sweetalert2';
import Button from '../../component/common/Button';
import ImageInput from '../../component/common/ImageInput';
import Radio from '../../component/common/Radio';
import ModalBtn from '@mui/material/Button';

import post from '../../axios/cart/Cart';
import { getLicenseImg } from '../../axios/order/Order';

import { ORDER_MODE } from '../../constants/mode';
import { EDITOR, PAYMENT } from '../../constants/path';
import PreviewLicense from './previewLicense/PreviewLicense';

export default function OrderOptions({ productId, productInfo, price, setPrice }) {
  let imageFile = '';
  const navigate = useNavigate();

  const { frameOption, setFrameOption } = useAppContext();
  const [license, setLicense] = useState({});
  const [mode, setMode] = useState('');
  const [additionalPrice, setAdditionalPrice] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [img, setImg] = useState({ id: '', src: '' });

  useEffect(() => {
    setFrameOption({});
    if (!productInfo?.custom) {
      getLicenseImg(productId).then((res) => {
        setLicense(res.data);
      });
    }
  }, []);

  useEffect(() => {
    let pricePerProduct = productInfo?.price;
    Object.values(additionalPrice).map((add) => {
      pricePerProduct += add;
    });
    setPrice(pricePerProduct);
  }, [additionalPrice]);

  const onHandleChange = (e, item, itemPrice) => {
    setFrameOption({
      ...frameOption,
      [e.target.name]: item,
    });
    setAdditionalPrice({
      ...additionalPrice,
      [e.target.name]: itemPrice,
    });
  };

  const onHandleImg = (id, src) => {
    setImg({ id, src });
  };

  const onHandleSubmit = (e) => {
    e.preventDefault();
    const options = Object.values(frameOption).map((item) => {
      return item.id;
    });

    let data = {};

    if (productInfo.custom) {
      imageFile = e.target.file.files[0];
      data = {
        productId: productInfo?.id,
        optionDetailIds: options,
        quantity: parseInt(quantity),
      };
    } else {
      imageFile = img.src;
      data = {
        productId: productInfo?.id,
        optionDetailIds: options,
        licenseOptionDetailId: img.id,
        quantity: parseInt(quantity),
      };
    }

    let pass = true;

    Object.values(productInfo.options).map((option, idx) => {
      if (option.require && !frameOption[`${option.name}`]) {
        Swal.fire({
          title: option.name + '을(를) 선택해주세요',
          icon: 'warning',
        });
        window.location.href = `#${idx}`;
        pass = false;
      }
    });
    if (!imageFile) {
      Swal.fire({
        title: '이미지를 입력해주세요',
        icon: 'warning',
      });
      window.location.href = '#add-image';
      pass = false;
    }
    switch (mode) {
      case ORDER_MODE.CART:
        if (!pass) break;
        post(data, imageFile, productInfo.custom);
        break;
      case ORDER_MODE.BUY:
        if (!pass) break;
        navigate(PAYMENT, {
          state: {
            frameOption,
            price,
            quantity,
            productName: productInfo.name,
            add_image: imageFile,
            ...(!productInfo.custom && { licenseOptionDetailId: img.id }),
          },
        });
      default:
        break;
    }
  };

  const addCart = () => {
    setMode(ORDER_MODE.CART);
  };

  const buy = () => {
    setMode(ORDER_MODE.BUY);
  };

  const moveToEditor = (e) => {
    e.preventDefault();
    navigate(EDITOR);
  };

  return (
    <div className='order-options'>
      <form className='order-inputs' onSubmit={onHandleSubmit}>
        <div className='order-inputs-selects'>
          <Options options={productInfo.options} onHandleChange={onHandleChange} />
          <AddImage
            custom={productInfo.custom}
            optionItems={license?.optionItems}
            moveToEditor={moveToEditor}
            onHandleImg={onHandleImg}
          />
          <Quantity
            productName={productInfo.name}
            quantity={quantity}
            setQuantity={setQuantity}
            price={price}
          />
          <div className='delivery-fee'>배송비: &#8361;{productInfo?.deliveryFee}</div>
          <div className='order-btn-group'>
            <Button text='구매하기' onClick={buy} />
            <Button text='장바구니' onClick={addCart} />
          </div>
        </div>
      </form>
    </div>
  );
}

const Options = ({ options, onHandleChange }) => {
  const numStripes = 4500; // 빗금 개수
  const stripeDensity = 3; // 밀도

  function generateDenseStripes() {
    let gradient = 'linear-gradient(45deg, ';
    const step = 100 / (numStripes * 2); // 빗금 하나당 간격 계산

    for (let i = 0; i <= numStripes; i++) {
      const position = i * (step * stripeDensity);
      if (i === numStripes) {
        gradient += `rgba(0, 0, 0, 0.2) ${position}%`;
      } else {
        gradient += `rgba(0, 0, 0, 0.2) ${position}%, transparent ${position}%, `;
      }
    }

    gradient += ')';
    return gradient;
  }

  // 종성이 있는 한글인지 체크
  function hasLastConsonantLetter(text) {
    return (text.charCodeAt(text.length - 1) - '가'.charCodeAt(0)) % 28 !== 0;
  }

  return (
    <>
      {options &&
        options.map((option, idx) => {
          return (
            <div key={idx} className='option'>
              <div id={idx} className='order-title'>
                {option.name}
                {hasLastConsonantLetter(option.name) ? '을' : '를'} 선택하세요
                {option.require && <span className='order-title'> *</span>}
              </div>
              {option.optionItems &&
                option.optionItems.map((item, idx) => {
                  const isDisabled = item.stock <= 0;
                  return (
                    <Radio
                      key={idx}
                      style={{
                        marginBottom: '10px',
                        opacity: isDisabled ? '0.6' : '1',
                        pointerEvents: isDisabled ? 'none' : 'auto', //if stock is none => prevent click
                        backgroundImage: isDisabled ? generateDenseStripes() : 'none',
                      }}
                      name={option.name}
                      text={item.name}
                      onChange={(e) => {
                        onHandleChange(e, item, item.price);
                      }}
                      required
                    >
                      <span style={{ color: '#bbbbbb' }}>
                        {` + `}&#8361;{`${item.price}`}
                      </span>
                      <span style={{ display: 'none' }}>{item.stock}</span>
                    </Radio>
                  );
                })}
            </div>
          );
        })}
    </>
  );
};

const AddImage = ({ custom, optionItems, moveToEditor, onHandleImg }) => {
  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleImageSelection = (id, src) => {
    setSelectedImg({ id, src });
    onHandleImg(id, src);
  };

  return (
    <>
      {custom ? (
        <div id='add-image' className='add-image'>
          <div className='order-title'>나만의 개성을 추가해봐요 *</div>
          <div className='radio-btn'>
            <ImageInput width='300px' height='150px' square />
          </div>
          <div className='order-editor'>
            <div style={{ color: '#1976d2' }} onClick={moveToEditor}>
              개성을 추가하러 가기
            </div>
          </div>
        </div>
      ) : (
        <>
          {selectedImg && (
            <div
              className='selected-image'
              style={{ marginTop: '20px', width: '300px', height: '200px' }}
            >
              <img src={selectedImg.src} alt='Selected' style={{ width: '100%', height: '100%' }} />
            </div>
          )}
          <ModalBtn onClick={handleOpen}>라이센스 이미지 보기</ModalBtn>
          {open && (
            <PreviewLicense
              optionItems={optionItems}
              onHandleImg={handleImageSelection}
              open={open}
              handleClose={handleClose}
            />
          )}
        </>
      )}
    </>
  );
};

const Quantity = ({ productName, quantity, setQuantity, price }) => {
  return (
    <div className='quantity'>
      <div className='quantity-content'>
        <span className='product-name'>{productName}</span>
        <div>
          <input
            type='number'
            name='quantity'
            value={quantity}
            min={1}
            required
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
          <span className='price'>&#8361;{(price * quantity).toLocaleString('ko-KR')}</span>
        </div>
      </div>
    </div>
  );
};
