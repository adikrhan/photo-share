import { FaEdit, FaTrash } from 'react-icons/fa';
import classes from './AdminPlaceItem.module.css';

const AdminPlaceItem = (props) => {
    return ( 
        <div className={classes.container}>
            <div className={classes['left-col']}>
                <div className={classes['thumbnail-container']}>
                    <img src={props.place.imgUrl} alt="" />
                </div>
                <span>{props.place.title}</span>
            </div>
            <div className={classes['right-col']}>
                <FaEdit />
                <FaTrash />
            </div>
        </div>
     );
}
 
export default AdminPlaceItem;