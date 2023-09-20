import Item2 from "./Item2";
import classes from "./AvailableItems.module.css";

const DUMMY_COURSE = [
  {
    id: "m1",
    author: "Zeroyoon",
    limitation: "무제한 수강",
    description: "C언어 입문자를 위한 강의",
    price: 20000,
  },
  {
    id: "m2",
    author: "Zeroyoon",
    limitation: "무제한 수강",
    description: "C언어 입문자를 위한 강의",
    price: 20000,
  },
  {
    id: "m3",
    author: "Zeroyoon",
    limitation: "무제한 수강",
    description: "C언어 입문자를 위한 강의",
    price: 20000,
  },
];

const AvailableItems = () => {
  const courseList = DUMMY_COURSE.map((course) => (
    <Item2
      id={course.id}
      key={course.id}
      img={course.img}
      author={course.author}
      limitation={course.limitation}
      description={course.description}
      price={course.price}
    />
  ));
  
  return <div className={`${classes.list} ${classes.item2}`}>{courseList}</div>;
};

export default AvailableItems;
