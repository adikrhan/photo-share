import Input from '../../shared/components/UI/Input';
import classes from './UsersHeader.module.css';

const UsersHeader = () => {
  return (
    <div className={classes.head}>
      <h2>Users</h2>
      <form>
        <Input
          type="text"
          id="userSearch"
          name="userSearch"
          placeholder="Search users"
        />
      </form>
    </div>
  );
};

export default UsersHeader;
