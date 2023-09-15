
import './ChainNode.scss';
export default function StyledNumber({ value }) {
    // If value is "1234.5678", this splits it into whole="1234" and decimal="5678"
    const [whole, decimal] = value.split('.');

    return (
       <>
            <span className="text-sm unbounded-medium text-gray-600">{whole}</span>
            <span className="text-xs text-gray-400">.{decimal}</span>
  </>
    );
}
