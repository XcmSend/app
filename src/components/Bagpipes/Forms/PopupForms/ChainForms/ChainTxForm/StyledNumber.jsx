
import react, { useContext } from 'react';
import ThemeContext from '../../../../../../contexts/ThemeContext';

import '../../../../node.styles.scss';


const StyledNumber = ({ value, symbol }) => {
  const { theme } = useContext(ThemeContext);
    // If value is "1234.5678", this splits it into whole="1234" and decimal="5678"
    const [whole, decimal] = value.split('.');

    const displayDecimal = decimal === '' || !decimal ? '0000' : decimal;



    return (
       <div className={` ${theme} primary-font`}>

            <span className={`text-xxs primary-font font-semibold whole-number `}>{whole}</span>
            <span className="text-xxs primary-font display-decimal">.{displayDecimal}</span>
            <span className="text-xxs primary-font font-semibold whole-number">{" "}{symbol}</span>

      </div>
    );
}

export default StyledNumber;
