import React, {useState} from 'react';
import MyModal from "../../../components/UI/MyModal/MyModal";

import MyButton from "../../../components/UI/button/MyButton";
import FloorsForm from "./FloorsForm";

const Floors = () => {
    const [modal, setModal] = useState(false);

    return (
        <div style={{margin: 5,width: '100%' }}>
            <MyModal visible={modal} setVisible={setModal}>
                <FloorsForm modal={ modal }/>
            </MyModal>

            <MyButton
                style={{width: '100%' }}
                onClick={() => setModal(true)}
                title={"Click to create a new floors"}
            >
                Управление этажами
            </MyButton>
        </div>
    );
};

export default Floors;