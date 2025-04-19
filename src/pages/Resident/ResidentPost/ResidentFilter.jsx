import MyInput from "../../../components/UI/input/MyInput";
import ResidentList from "./ResidentList";


const ResidentFilter = ({filter, setFilter}) => {
    return (
        <div>
            <MyInput
                placeholder="Search"
                value={filter.query}
                onChange={e => setFilter({...filter, query: e.target.value})}
            />
        </div>
    );
};

export default ResidentFilter;