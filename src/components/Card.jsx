import { CardContent } from "@material-ui/core";

function Card({ note, date, color }) {
  console.log(note,date)
  return (
    <CardContent
      style={{
        float: "left",
        minWidth: 300,
        maxWidth: 300,
        minHeight: 200,
        backgroundColor: color,
        borderRadius: "2.5%",
        marginRight: "10px",
        marginTop: "10px",
      }}
    >
      <p style={{ fontSize: 12 }}>{date}</p>
      <br />
      <p>{note}</p>
    </CardContent>
  );
}

export default Card;
