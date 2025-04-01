import {repository} from '@loopback/repository';
import {
  AssignmentDataRepository,
  UserDataRepository,
  SubmissionDataRepository,
  LocationDataRepository,
} from '../repositories';
import {get, response} from '@loopback/rest';
import {AssignmentData, UserData} from '../models';

export class ReportingController {
  constructor(
    @repository(AssignmentDataRepository)
    public assignmentDataRepository: AssignmentDataRepository,
    @repository(UserDataRepository)
    public userDataRepository: UserDataRepository,
    @repository(SubmissionDataRepository)
    public submissionDataRepository: SubmissionDataRepository,
    @repository(LocationDataRepository)
    public locationDataRepository: LocationDataRepository,
  ) {}

  // Helper function to calculate reporting periods
  calculateReportingPeriods(
    startDate: string,
    endDate: string,
    frequency: number,
  ): string[] {
    const periods = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      periods.push(
        `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`,
      );
      currentDate.setMonth(currentDate.getMonth() + frequency);
    }

    return periods;
  }

  // Helper function to get users by their IDs
  async getUsersByIds(userIds: number[]): Promise<UserData[]> {
    return await this.userDataRepository.find({
      where: {id: {inq: userIds}},
    });
  }

  // Helper function to get submission status
  getSubmissionStatus(submission: any): string {
    // If no submission or no type, return 'Pending Submission'
    if (
      !submission ||
      submission.type === undefined ||
      submission.type === null
    ) {
      return 'Pending Submission';
    }

    // Match the status based on type
    switch (submission.type) {
      case 1:
        return 'Under Review';
      case 2:
        return 'Under Approval';
      case 3:
        return 'Approved';
      default:
        return 'Pending Submission'; // Default case if type is not 1, 2, or 3
    }
  }

  // Helper function to get entity (based on location and level)
  async getEntity(level: number, locationId: number): Promise<any> {
    const location = await this.locationDataRepository.findOne({
      where: {id: locationId},
    });
    return location ? location : 'Unknown Entity';
  }

  // Main method to generate the report
  @get('/generate-report')
  @response(200, {
    description: 'Generate Report of Submissions with Status Mapping',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              dcfId: {type: 'number'},
              reporting_period: {type: 'string'},
              status: {type: 'string'},
              reporter: {type: 'string'},
              reviewer: {type: 'string'},
              entity: {type: 'string'},
            },
          },
        },
      },
    },
  })
  async generateReport(): Promise<any[]> {
    // 1. Fetch all assignment data
    const assignments = await this.assignmentDataRepository.find();

    // 2. Fetch existing submissions
    const submissions = await this.submissionDataRepository.find();

    // 4. Prepare the report data
    const reportData = [];

    for (const assignment of assignments) {
      // 4.1 Calculate expected reporting periods
      const expectedPeriods = this.calculateReportingPeriods(
        assignment.start_date,
        assignment.end_date,
        assignment.frequency,
      );

      // 4.2 Fetch users for reporter and reviewer based on their IDs
      const reporters = await this.getUsersByIds(assignment.reporter_ids);
      const reviewers = await this.getUsersByIds(assignment.reviewer_ids!);

      const reporterNames =
        reporters.map(user => user.information['empname']).join(', ') ||
        'Not Assigned';
      const reviewerNames =
        reviewers.map(user => user.information['empname']).join(', ') ||
        'Not Assigned';

      // 4.3 Get the entity name based on location and level
      const entity = await this.getEntity(
        assignment.level,
        assignment.locationId,
      );

      // 4.4 Loop through the expected periods and compare with existing submissions
      for (const period of expectedPeriods) {
        const submission = submissions.find(
          sub =>
            sub.dcfId === assignment.dcfId &&
            sub.locationId === assignment.locationId,
        );

        const status = this.getSubmissionStatus(submission);

        // 4.5 Push the formatted report data for each period
        reportData.push({
          dcfId: assignment.dcfId,
          reporting_period: period,
          status: status,
          reporter: reporterNames,
          reviewer: reviewerNames,
          entity: entity,
        });
      }
    }

    return reportData;
  }
}
