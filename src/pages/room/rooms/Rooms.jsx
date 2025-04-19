import React, {useState} from 'react';
import MyModal from "../../../components/UI/MyModal/MyModal";
import MyButton from "../../../components/UI/button/MyButton";
import BlocksForm from "./RoomsForm";

const Rooms = () => {
    const [modal, setModal] = useState(false);

    return (
        <div style={{margin: 5, width: '100%'}}>
            <MyModal visible={modal} setVisible={setModal}>
                <BlocksForm/>
            </MyModal>

            <MyButton
                style={{width: '100%' }}
                onClick={() => setModal(true)}
                title={"Click to create a new blocks"}
            >
                Управление комнатами
            </MyButton>
        </div>
    );
};

export default Rooms;