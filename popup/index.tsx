import LogoSvg from "react:~assets/logo.svg"
import "~/popup/styles.less";
import "rsuite/styles/index.less";
import { useEffect, useState } from "react";
import { getSetting, saveSetting } from "~utils";
import { Schema, type FormProps, Form, ButtonToolbar, Button } from "rsuite";

const model = Schema.Model({
    API_KEY: Schema.Types.StringType().isRequired('This field is required.'),
  });

function IndexPopup() {
  const [formValue,setFormValue] = useState({ API_KEY : "" });  

  const handleSave : FormProps['onSubmit'] = (checkStatus, event)=>{
    if(!checkStatus) return;
    console.log(formValue);
    saveSetting(formValue);
  }; 

  const init = async ()=>{
    const setting = await getSetting();
    setFormValue({ API_KEY : setting.API_KEY });
  };

  useEffect(()=>{
    init();
  },[]);


  return (
    <div className="ai-translator-popup">
        <div className="ai-translator-header">
          <span style={{
            display: "block",
            width: 20,
            height: 20,
            marginRight:8
          }} ><LogoSvg /></span>
          <span>AI Translator</span>
        </div>
        <Form className="ai-translator-form" model={model} formValue={formValue} onSubmit={handleSave} onChange={setFormValue}>
            <Form.Group controlId="API_KEY">
                <Form.ControlLabel style={{ fontWeight : "bolder" }} >API Key</Form.ControlLabel>
                <Form.Control name="API_KEY" type="password" autoComplete="off" />
            </Form.Group>
            <Form.Group>
                <ButtonToolbar style={{ justifyContent : "flex-end" }}>
                    <Button appearance="primary" type="submit">save</Button>
                </ButtonToolbar>
            </Form.Group>
        </Form>
    </div>
  )
}

export default IndexPopup
