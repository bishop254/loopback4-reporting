import {repository} from '@loopback/repository';
import {
  AssignmentDataRepository,
  UserDataRepository,
  SubmissionDataRepository,
  LocationDataRepository,
} from '../repositories';
import {get, response} from '@loopback/rest';
import {UserData} from '../models';

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

  async getUsersByIds(userIds: number[]): Promise<UserData[]> {
    return await this.userDataRepository.find({
      where: {id: {inq: userIds}},
    });
  }

  getSubmissionStatus(submission: any): string {
    if (
      !submission ||
      submission.type === undefined ||
      submission.type === null
    ) {
      return 'Pending Submission';
    }

    switch (submission.type) {
      case 1:
        return 'Under Review';
      case 2:
        return 'Under Approval';
      case 3:
        return 'Approved';
      default:
        return 'Pending Submission';
    }
  }

  async getEntity(level: number, locationId: number): Promise<any> {
    const location = await this.locationDataRepository.findOne({
      where: { id: locationId },
    });
  
    if (!location) {
      return 'Unknown Entity';
    }
  
    if (level === 1) {
      return location;
    }
  
    if (level === 2) {
      return location.locationTwos ?? 'No Level 2 Data';
    }
  
    if (level === 3) {
      return location.locationTwos?.flatMap(loc => loc.locationThrees) ?? 'No Level 3 Data';
    }
  
    return 'Invalid Level';
  }
  

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
              entity: {type: 'any'},
            },
          },
        },
      },
    },
  })
  async generateReport(): Promise<any[]> {
    const assignments = await this.assignmentDataRepository.find();
    const submissions = await this.submissionDataRepository.find();

    const reportData = [];

    for (const assignment of assignments) {
      const expectedPeriods = this.calculateReportingPeriods(
        assignment.start_date,
        assignment.end_date,
        assignment.frequency,
      );

      const reporters = await this.getUsersByIds(assignment.reporter_ids);
      const reviewers = await this.getUsersByIds(assignment.reviewer_ids!);

      const reporterNames =
        reporters.map(user => user.information['empname']).join(', ') ||
        'Not Assigned';
      const reviewerNames =
        reviewers.map(user => user.information['empname']).join(', ') ||
        'Not Assigned';

      const entity = await this.getEntity(
        assignment.level,
        assignment.locationId,
      );

      for (const period of expectedPeriods) {
        const submission = submissions.find(
          sub =>
            sub.dcfId === assignment.dcfId &&
            sub.locationId === assignment.locationId,
        );

        const status = this.getSubmissionStatus(submission);

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
