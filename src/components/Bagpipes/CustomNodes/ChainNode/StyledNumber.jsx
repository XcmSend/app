
import './ChainNode.scss';
import '../../node.styles.scss';
import '../../../../index.css';
import '../../../../variables.scss';
export default function StyledNumber({ value }) {
    // If value is "1234.5678", this splits it into whole="1234" and decimal="5678"
    const [whole, decimal] = value.split('.');

    return (
       <div className='primary-font'>
            <span className="text-xxs primary-font font-semibold text-gray-800">{whole}</span>
            <span className="text-xxs primary-font text-gray-400">.{decimal}</span>
      </div>
    );
}
