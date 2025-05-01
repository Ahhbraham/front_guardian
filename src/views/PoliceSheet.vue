<template>
  <v-app>
    <v-main>
      <v-container fluid class="full-screen-container">
        <v-row justify="center" class="mb-6">
          <v-col cols="12" sm="6" md="4" class="text-center">
            <v-img src="../assets/header.png" max-height="80" max-width="240" class="mx-auto" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h4 mb-4 text-center">Non-Emergency Crime Report Details</h1>
            <p class="mb-4 text-center">
              This sheet displays the details of a submitted non-emergency crime report for review.
            </p>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8" xl="8">
            <v-card class="report-sheet-container">
              <v-card-text>
                <h2 class="text-h5 mb-4">Reporter Information</h2>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="report.anonymous ? 'Anonymous' : report.firstName"
                      label="First Name"
                      outlined
                      dense
                      color="#000c66"
                      readonly
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="report.anonymous ? 'Anonymous' : report.lastName"
                      label="Last Name"
                      outlined
                      dense
                      color="#000c66"
                      readonly
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="report.anonymous ? 'N/A' : report.email"
                      label="Email"
                      outlined
                      dense
                      color="#000c66"
                      readonly
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="report.anonymous ? 'N/A' : report.phone"
                      label="Phone Number"
                      outlined
                      dense
                      color="#000c66"
                      readonly
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :value="report.anonymous ? 'N/A' : report.address || 'Not provided'"
                      label="Address"
                      outlined
                      dense
                      color="#000c66"
                      readonly
                    />
                  </v-col>
                </v-row>
                <v-checkbox
                  :model-value="report.anonymous"
                  label="Submitted anonymously"
                  color="#000c66"
                  class="mt-0"
                  readonly
                  disabled
                />
                <h2 class="text-h5 mb-4 mt-6">Incident Details</h2>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :value="report.crimeType"
                      label="Crime Type"
                      outlined
                      dense
                      color="#000c66"
                      readonly
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="report.incidentDate"
                      label="Incident Date"
                      outlined
                      dense
                      color="#000c66"
                      readonly
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :value="report.unknownLocation ? 'Unknown' : report.incidentLocation"
                      label="Incident Location"
                      outlined
                      dense
                      color="#000c66"
                      readonly
                    />
                  </v-col>
                </v-row>
                <v-checkbox
                  :model-value="report.unknownLocation"
                  label="Unknown location"
                  color="#000c66"
                  class="mt-0"
                  readonly
                  disabled
                />
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      :value="report.description"
                      label="Incident Description"
                      outlined
                      dense
                      color="#000c66"
                      readonly
                    />
                  </v-col>
                </v-row>
                <h2 class="text-h5 mb-4 mt-6">Attachments</h2>
                <v-row>
                  <v-col cols="12">
                    <v-list v-if="report.attachments && report.attachments.length">
                      <v-list-item v-for="(attachment, index) in report.attachments" :key="index">
                        <v-list-item-title>
                          <a :href="attachment.url" target="_blank">{{ attachment.name }}</a>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                    <p v-else>No attachments provided</p>
                  </v-col>
                </v-row>
                <h2 class="text-h5 mb-4 mt-6">Witness Information</h2>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="report.witnessName || 'Not provided'"
                      label="Witness Name"
                      outlined
                      dense
                      color="#000c66"
                      readonly
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="report.witnessContact || 'Not provided'"
                      label="Witness Contact"
                      outlined
                      dense
                      color="#000c66"
                      readonly
                    />
                  </v-col>
                </v-row>
                <h2 class="text-h5 mb-4 mt-6">Follow-Up Preferences</h2>
                <v-row>
                  <v-col cols="12">
                    <v-checkbox
                      :model-value="report.allowContact"
                      label="Agreed to be contacted for further details"
                      color="#000c66"
                      class="mt-0"
                      readonly
                      disabled
                    />
                  </v-col>
                </v-row>
                <h2 class="text-h5 mb-4 mt-6">Consent</h2>
                <v-row>
                  <v-col cols="12">
                    <v-checkbox
                      :model-value="report.consent"
                      label="Confirmed report is truthful"
                      color="#000c66"
                      class="mt-0"
                      readonly
                      disabled
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="text-center">
                    <v-btn
                      color="#000c66"
                      style="
                        max-width: 300px;
                        width: 100%;
                        padding: 0.75rem;
                        color: #000c66;
                        background-color: #e2e2f3;
                      "
                      @click="$router.go(-1)"
                    >
                      Back
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'GuardianReportPoliceSheet',
  props: {
    report: {
      type: Object,
      required: true,
      default: () => ({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        anonymous: false,
        crimeType: '',
        incidentDate: '',
        incidentLocation: '',
        unknownLocation: false,
        description: '',
        attachments: [],
        witnessName: '',
        witnessContact: '',
        allowContact: false,
        consent: false,
      }),
    },
  },
}
</script>

<style scoped>
.full-screen-container {
  --spacer: 1.5rem;
  padding: 24px;
  min-height: 100vh;
  background: #f5f5f5;
}
.report-sheet-container {
  width: 100%;
  max-width: 1200px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background: white;
}
.v-text-field,
.v-textarea,
.v-list {
  margin-bottom: 8px;
}
.text-h5 {
  color: #000c66;
  font-weight: 600;
}
.text-h4 {
  color: #000c66;
  font-weight: 700;
}
</style>
