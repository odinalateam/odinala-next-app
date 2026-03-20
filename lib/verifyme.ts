const VERIFYME_BASE_URL = "https://vapi.verifyme.ng/v1/verifications/identities";
const VERIFYME_SECRET_KEY = process.env.VERIFYME_SECRET_KEY;

interface VerifyNINResponse {
  success: boolean;
  data?: {
    fieldMatches: {
      firstname: boolean;
      lastname: boolean;
      dob: boolean;
    };
    nin: number;
    firstname: string;
    lastname: string;
    middlename: string;
    phone: string;
    gender: string;
    birthdate: string;
    photo: string;
  };
  error?: string;
}

interface VerifyTINResponse {
  success: boolean;
  data?: {
    tin: string;
    taxpayerName: string;
    cacRegNo: string;
    entityType: string;
    jittin: string;
    taxOffice: string;
    phone: string;
    email: string;
  };
  error?: string;
}

export async function verifyNIN(
  nin: string,
  firstname: string,
  lastname: string,
  dob: string
): Promise<VerifyNINResponse> {
  if (!VERIFYME_SECRET_KEY) {
    return { success: false, error: "VerifyMe API key not configured" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${VERIFYME_BASE_URL}/nin/${nin}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERIFYME_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstname, lastname, dob }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error:
          errorData?.message ||
          `NIN verification failed (status ${response.status})`,
      };
    }

    const result = await response.json();
    if (result.status === "success") {
      return { success: true, data: result.data };
    }
    return { success: false, error: "NIN verification returned unsuccessful" };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "NIN verification timed out" };
    }
    return { success: false, error: "NIN verification failed" };
  }
}

export async function verifyTIN(tin: string): Promise<VerifyTINResponse> {
  if (!VERIFYME_SECRET_KEY) {
    return { success: false, error: "VerifyMe API key not configured" };
  }

  const tinPattern = /^\d{8}-\d{4}$/;
  if (!tinPattern.test(tin)) {
    return {
      success: false,
      error: "Invalid TIN format. Expected format: XXXXXXXX-XXXX",
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${VERIFYME_BASE_URL}/tin/${tin}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${VERIFYME_SECRET_KEY}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error:
          errorData?.message ||
          `TIN verification failed (status ${response.status})`,
      };
    }

    const result = await response.json();
    if (result.status === "success") {
      return { success: true, data: result.data };
    }
    return { success: false, error: "TIN verification returned unsuccessful" };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "TIN verification timed out" };
    }
    return { success: false, error: "TIN verification failed" };
  }
}
