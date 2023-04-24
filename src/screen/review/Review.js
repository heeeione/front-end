import "./Review.css";
import React, { useState, useEffect } from "react";
import Checkbox from "../../component/Checkbox";
import Image from "../../component/Image";
import ImageInput from "../../component/ImageInput";
import Button from "../../component/Button";
import pencil from "../../image/icon/pencil.png";
import star from "../../image/icon/star.png";
import star_filled from "../../image/icon/star_filled.png";
import close from "../../image/icon/close.png";
import {
  deleteReview,
  getReview,
  postReview,
  putReview,
} from "../../axios/review/Review";

function Modal(props) {
  const modalInfo =
    props.reviewInfo === undefined
      ? {
          rating: 1,
          imageUrls: ["", "", ""],
          content: "",
        }
      : props.reviewInfo;
  console.log(modalInfo);
  const [rating, setRating] = useState(modalInfo.rating);
  const [text, setText] = useState(modalInfo.content);

  return (
    <div className="modal">
      <div className="modal-content">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // console.log(rating);
            // console.log(e.target.content.value);
            // console.log(e.target.file[0].files);
            // console.log(e.target.file[1].files);
            // console.log(e.target.file[2].files);
            const dto = {
              rating: rating,
              content: e.target.content.value,
            };
            if (props.reviewInfo === undefined) {
              console.log(dto);
              console.log(e.target.file);
              postReview(
                dto,
                e.target.file,
                "6343dcf2-83f8-451a-ae6d-d1faf953167a"
              );
            } else putReview(dto, e.target.file, modalInfo.reviewId);
          }}
        >
          <div className="title">
            <span></span>
            <span>리뷰 작성</span>
            <img src={close} onClick={props.closeModal} />
          </div>
          <div className="rating">
            <img src={star_filled} onClick={() => setRating(1)} />
            <img
              src={rating < 2 ? star : star_filled}
              onClick={() => setRating(2)}
            />
            <img
              src={rating < 3 ? star : star_filled}
              onClick={() => setRating(3)}
            />
            <img
              src={rating < 4 ? star : star_filled}
              onClick={() => setRating(4)}
            />
            <img
              src={rating < 5 ? star : star_filled}
              onClick={() => setRating(5)}
            />
          </div>
          <textarea
            name="content"
            value={text}
            required
            onChange={(e) => {
              setText(e.target.value);
            }}
          ></textarea>
          <div className="images">
            <ImageInput imgFile={modalInfo.imageUrls[0]} />
            <ImageInput imgFile={modalInfo.imageUrls[1]} />
            <ImageInput imgFile={modalInfo.imageUrls[2]} />
          </div>
          <Button text="등록" />
        </form>
      </div>
    </div>
  );
}

function ReviewContent(props) {
  const [modal, showModal] = useState(false);
  const reviewInfo = props.reviewInfo;

  const filesChildNode = [];
  reviewInfo.imageUrls.map((imageUrl) => {
    filesChildNode.push(<Image image={imageUrl} />);
  });

  return (
    <div className="review-content">
      {modal ? (
        <Modal closeModal={() => showModal(false)} reviewInfo={reviewInfo} />
      ) : (
        <></>
      )}
      <div className="review-header">
        <div className="user">
          <Image image={reviewInfo.authorProfileUrl} />
          <div className="name">{reviewInfo.authorName}</div>
          <div className="rating">
            <img src={star_filled} />
            <img src={reviewInfo.rating < 2 ? star : star_filled} />
            <img src={reviewInfo.rating < 3 ? star : star_filled} />
            <img src={reviewInfo.rating < 4 ? star : star_filled} />
            <img src={reviewInfo.rating < 5 ? star : star_filled} />
          </div>
        </div>
        <div className="content-buttons">
          <span>
            <a
              onClick={() => {
                showModal(true);
              }}
            >
              수정
            </a>
          </span>
          <span>|</span>
          <span>
            <a
              onClick={() => {
                deleteReview(reviewInfo.reviewId);
              }}
            >
              삭제
            </a>
          </span>
        </div>
      </div>
      <div className="content">{reviewInfo.content}</div>
      <div className="files">{filesChildNode}</div>
    </div>
  );
}

export default function Review() {
  const [modal, showModal] = useState(false);

  const contents = [];
  const pages = [];
  useEffect(() => {
    // getReview("LIB-001", 1, 5, false).then((res) => {
    //   const contents = res.contents;
    //   for (var i = 0; i < contents.length; i++) {
    //     const reviewInfo = {
    //       reviewId: contents.reviewId,
    //       rating: contents.rating,
    //       imageUrls: contents.imageUrls,
    //       content: contents.content,
    //       authorProfileUrl: contents.authorProfileUrl,
    //       authorName: contents.authorName,
    //     };
    //     contents.push(<ReviewContent reviewInfo={reviewInfo} />);
    //   }
    //   for (var j = res.startPage; j <= res.lastPage; j++) {
    //     if (j === res.currentPage)
    //       pages.push(<span className="active">{j}</span>);
    //     else pages.push(<span>{j}</span>);
    //   }
    // });
  }, []);

  return (
    <div className="review">
      {modal ? <Modal closeModal={() => showModal(false)} /> : <></>}
      <div className="tab">리뷰</div>
      <div className="title-div">
        <div className="title">구매평 (개수)</div>
      </div>
      <Button text="구매평 쓰기" onClick={() => showModal(true)}></Button>
      <div className="filter">
        <Checkbox text="포토 구매평만 보기" />
      </div>
      <div>{contents}</div>
      <div className="pages">{pages}</div>
    </div>
  );
}
