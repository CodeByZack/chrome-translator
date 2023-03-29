import type { IPosition } from "~contents/scripts";
import LogoSvg from "react:~assets/logo.svg"
import type { CSSProperties } from "react";

interface IProps extends IPosition {
    showTranslator?: () => void;
}

const Logo = (props: IProps) => {
    const { x, y, showTranslator = ()=>{} } = props;

    const style: CSSProperties = {
        width: 25, height: 25,
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
        padding: 4,
        backgroundColor: "white",
        borderRadius: 4,
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 4px',
        cursor: "pointer"
    };

    return <div style={style} onMouseUp={e => e.stopPropagation()} onMouseDown={(e) => {
        e.stopPropagation()
        showTranslator();
    }}>
        <LogoSvg style={{ display : "block" }} />
    </div>
}

export default Logo;