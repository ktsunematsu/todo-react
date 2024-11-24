export const InputTodo = (props) => {
    const { todoText, onChange, onClickAdd } = props;
    return (
        <div className='input-area'>
            <input placeholder='TODOを入力してください' value={todoText} onChange={onChange} />
            <button onClick={onClickAdd}>追加</button>
      </div>
    );
};