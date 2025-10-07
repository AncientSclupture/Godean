import React from "react"
import { ModalContext } from "../../context/ModalContext"
import { X } from "lucide-react";
import { AuthenticationContext } from "../../context/AuthContext";

enum loginoption {
    wallet = "wallet",
    manualid = "manualid"
}

export default function ModalLoginOption() {
    const { setModalKind } = React.useContext(ModalContext);
    const { manualLogin, login } = React.useContext(AuthenticationContext);

    const [loginOption, setLoginOption] = React.useState<loginoption | null>(null);
    const [inputId, setInputId] = React.useState("");

    function handleclose() {
        setModalKind(null);
        setLoginOption(null);
        setInputId("");
    }

    function handleChangeOpotionLogin(d: loginoption) {
        if (d === loginoption.wallet) {
            setLoginOption(d);
            setInputId("")
        } else {
            setLoginOption(d);
        }
    }

    function handleManualLogin(d: string){
        manualLogin(d);
        handleclose()
    }

    function handleLoginWallet(){
        login();
        handleclose();
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="font-semibold">Login</h1>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={() => handleclose()}
                        >
                            <X size={12} color="white" />
                        </button>
                    </div>
                    {/* content */}
                    <div className="space-y-2">
                        <div className="space-y-2">
                            <button
                                className="p-1 bg-blue-950 rounded-md text-white w-full"
                                onClick={() => handleChangeOpotionLogin(loginoption.wallet)}
                            >
                                Connect With Wallet
                            </button>
                            <div className={`space-y-1 flex flex-col justify-start items-start ${loginOption === loginoption.wallet ? '' : 'hidden'}`}>
                                <button onClick={() => handleLoginWallet()}>Metamask</button>
                                <button>Other</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <button
                                className="p-1 bg-blue-950 rounded-md text-white w-full"
                                onClick={() => handleChangeOpotionLogin(loginoption.manualid)}
                            >
                                Set my id (demo purpose)
                            </button>
                            <div className={`space-y-2 ${loginOption === loginoption.manualid ? '' : 'hidden'}`}>
                                <input
                                    type="text" name="id" id="id"
                                    className="p-1 rounded-md w-full border border-gray-300"
                                    disabled={loginOption === loginoption.wallet}
                                    placeholder="set your id, ex.id-12930"
                                    value={inputId}
                                    onChange={(e) => setInputId(e.target.value)}
                                />
                                <button onClick={() => handleManualLogin(inputId)} className="text-white bg-blue-800 hover:bg-blue-950 p-1 rounded-md w-full">VALIDATE AND OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};