const generateRefNo = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let refNo = '';
    for (let i = 0; i < 6; i++) {  // กำหนดความยาว ref_no
        const randomIndex = Math.floor(Math.random() * characters.length);
        refNo += characters[randomIndex];
    }
    return refNo;
};

module.exports = generateRefNo 