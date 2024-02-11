import { AADHAAR_KYC_CODE, AADHAAR_SUBMIT_OTP, GSTIN_KYC_CODE, KYC_COMMON_ERROR, KYC_URL_TEST } from '@/constants/kyc.constant';
import { httpPost } from './http.util';
import { badUserInputException } from './exceptions.util';
import { isMobilePhone } from 'class-validator';
import { KYCStatus, UserKYC } from '@prisma/client';
import { USER_ERROR_KEYS } from '@/constants';

const URL = KYC_URL_TEST;

const getHeader = () => ({
  'X-API-Key': 123,
  'X-Auth-Type': 'API-Key',
  // Prefer: 'code=400', 
});

/**
 * Sends a request to generate an One-Time Password (OTP) for Aadhaar verification.
 * @param aadhaarNumber - The Aadhaar number for which to generate the OTP.
 * @param consent - The consent value for generating the OTP. Default is 'Y'.
 * @returns A Promise that resolves to the response data of the request.
 */
export const sendAadhaarOtpRequest = async ({
  aadhaarNumber,
  consent = 'Y',
}: {
  aadhaarNumber: string;
  consent?: string;
}): Promise<unknown> => {
  try {
    const response = await httpPost(URL.AADHAAR_GENERATE_OTP, {
      body: {
        aadhaar_number: aadhaarNumber,
        consent,
      },
      headers: getHeader(),
    }) as { data: unknown; error: unknown; status: string };
    const { error, status } = response;
    const data = response.data as { code?: string };
    if (data && data?.code !== '1001') {
      throw { error: data } as { code?: string };
    } else if (error) {
      throw { error };
    } else if (!data) {
      throw {  
        error: { code: status }
      };
    }
    return data;
  } catch (error: any) {
    if (error?.code) {
      const message = AADHAAR_KYC_CODE[error.code];
      if (message) {
        throw badUserInputException(message);
      }
    }
    throw badUserInputException(KYC_COMMON_ERROR);
  }
};

/**
 * Submits the Aadhaar OTP for verification.
 * 
 * @param otp - The OTP to be submitted.
 * @param shareCode - The share code for the Aadhaar OTP.
 * @param transactionId - The transaction ID for the request.
 * @returns The response data from the server.
 * @throws {Error} If there is an error during the submission.
 */
export const submitAadhaarOtp = async ({
  otp,
  shareCode,
  transactionId,
}: {
  otp: number;
  shareCode: string;
  transactionId: string;
}) => {
  try {
    const response = await httpPost(URL.AADHAAR_SUBMIT_OTP, {
      body: {
        otp,
        share_code: shareCode,
      },
      headers: {
        'X-Transaction-ID': transactionId,
        ...getHeader(),
      },
    }) as { data: any; error: { code?: string } ; status: string };
    const { data, error, status } = response;

    if (data && data.code !== '1002') {
      throw { error: data };
    } else if (error) {
      throw { error };
    } else if (!data) {
      throw {
        error: { code: status },
      };
    }
    return data;
  } catch (error: any) {
    if (error.code) {
      const message = AADHAAR_SUBMIT_OTP[error.code];

      if (message) {
        throw badUserInputException(message);
      }
    }
    console.log(error);
    throw badUserInputException(KYC_COMMON_ERROR);
  }
};

/**
 * Retrieves GSTIN details from the server.
 * 
 * @param {number} gstin - The GSTIN number.
 * @param {string} consent - The consent value. Default is 'Y'.
 * @returns {Promise<object>} - The GSTIN details.
 * @throws {Error} - If there is an error retrieving the GSTIN details.
 */
export const getGstinDetail = async ({ gstin, consent = 'Y' }: { gstin: string; consent: string }) => {
  try {
    const response = await httpPost(URL.GSTIN_DETAILS, {
      body: {
        gstin,
        consent,
      },
      headers: getHeader(),
    }) as { data: any; error: any; status: string };
    const { data, error, status } = response;
    console.log(data, error);
    // If data is present and code is not '1000', throw an error
    if (data && data?.code !== '1000') {
      throw { error: data };
    } 
    // If error is present, throw an error
    else if (error) {
      throw { error };
    }
    // If data is not present, throw an error with the status code
    else if (!data) {
      throw {
        error: { code: status },
      };
    }

    if (data.gstin_data.status !== 'Active' || !isMobilePhone(data.gstin_data.principal_address.mobile)) {
      throw {
        error: { code: 1008 },
      };
    }
    
    return data.gstin_data;
  } catch (error: any) {
    if (error?.code) {
      const message = GSTIN_KYC_CODE[error?.code as string];
      // If there is a message for the error code, throw a bad user input exception
      if (message) {
        throw badUserInputException(message);
      }
    }
    // If no specific error code is found, throw a generic bad user input exception
    throw badUserInputException(KYC_COMMON_ERROR);
  }
}

export const checkForSkipStatus = (kyc: UserKYC| null) => {
  if(!kyc || kyc && kyc.status === KYCStatus.Pending) {
    return kyc;
  }
  throw badUserInputException(USER_ERROR_KEYS.INVALID_KYC_REQUEST);
}

export const checkForSelfiePhone = (kyc: UserKYC | null) => {
  if(!kyc || kyc && (kyc.status === KYCStatus.Skipped || kyc.status === KYCStatus.Pending)) {
    return kyc;
  }
  throw badUserInputException(USER_ERROR_KEYS.INVALID_KYC_REQUEST);
}
