
const Spinner = (props) => (
    <div className="loading" style={{display: props.show === true ? 'block' : 'none'}}>
        <div className="loading-spinner"></div>
    </div>
);
  
export default Spinner;
