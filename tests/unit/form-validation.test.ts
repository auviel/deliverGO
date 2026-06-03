import { describe, expect, it } from "vitest";
import {
  validateDeliveryFormFields,
  validateLoginFields,
} from "@/lib/domain/delivery/form-validation";
import type { GeocodedAddress } from "@/lib/integrations/geocoding/types";

const geocodedAddress: GeocodedAddress = {
  address: {
    line1: "200 University Ave W",
    city: "Waterloo",
    province: "ON",
    postalCode: "N2L 3G1",
    country: "CA",
    latitude: 43.4723,
    longitude: -80.5449,
    formatted: "200 University Ave W, Waterloo, ON N2L 3G1, CA",
  },
  relevance: 0.9,
  confidence: "high",
  preview: "200 University Ave W, Waterloo, ON N2L 3G1, CA",
};

describe("validateDeliveryFormFields", () => {
  it("returns no errors for valid input", () => {
    const errors = validateDeliveryFormFields({
      dropoffName: "Jane Doe",
      dropoffPhone: "5195550100",
      geocoded: geocodedAddress,
      geocodeError: null,
    });

    expect(errors).toEqual({});
  });

  it("returns plain-language field errors", () => {
    const errors = validateDeliveryFormFields({
      dropoffName: "",
      dropoffPhone: "123",
      geocoded: null,
      geocodeError: "No matching address found.",
    });

    expect(errors.dropoffName).toMatch(/customer name/i);
    expect(errors.dropoffPhone).toMatch(/Canadian phone/i);
    expect(errors.dropoffAddress).toBe("No matching address found.");
  });
});

describe("validateLoginFields", () => {
  it("validates email and password", () => {
    expect(validateLoginFields({ email: "", password: "" })).toEqual({
      email: "Enter your email address.",
      password: "Enter your password.",
    });
  });
});
