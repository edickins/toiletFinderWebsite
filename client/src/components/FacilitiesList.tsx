import { IFacility } from '../context/toiletContext/types';
import FacilityFormItem from './FacilityFormItem';

type FacilitiesProp = {
  facilities: IFacility[];
  handleFilterClick: () => void;
};

function FacilitiesList({ facilities, handleFilterClick }: FacilitiesProp) {
  return (
    <>
      <ul className='list-none'>
        {facilities &&
          facilities.map((facility) => {
            return (
              <FacilityFormItem facility={facility} key={facility.short_name} />
            );
          })}
      </ul>
    </>
  );
}

export default FacilitiesList;
