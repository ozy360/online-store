import { Oval } from "react-loader-spinner";

const LoadingSpinner = () => {
  return (
    // <div className="h-full w-full mt-20 lg:mt-25 flex justify-center items-center">
    <div className="centered-div">
      <Oval
        height={70}
        width={70}
        color="#000000"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor=""
        strokeWidth={5}
        strokeWidthSecondary={0}
      />
    </div>
  );
};

export default LoadingSpinner;
