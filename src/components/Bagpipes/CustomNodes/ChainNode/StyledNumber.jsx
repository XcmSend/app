
import './ChainNode.scss';
export default function StyledNumber({ value }) {
    // If value is "1234.5678", this splits it into whole="1234" and decimal="5678"
    const [whole, decimal] = value.split('.');

    return (
       <>
            <span className="text-xs unbounded-bold text-gray-800">{whole}</span>
            <span className="text-xxs text-gray-500">.{decimal}</span>
  </>
    );
}
