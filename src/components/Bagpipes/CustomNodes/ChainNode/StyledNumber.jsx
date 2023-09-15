export default function StyledNumber({ value }) {
    // If value is "1234.5678", this splits it into whole="1234" and decimal="5678"
    const [whole, decimal] = value.split('.');

    return (
       <>
            <span className="text-lg text-black">{whole}</span>
            <span className="text-sm text-gray-400">.{decimal}</span>
  </>
    );
}
