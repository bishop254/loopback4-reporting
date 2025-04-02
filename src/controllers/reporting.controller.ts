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

  async getUsersByIds(userIds: number[]): Promise<UserData[]> {
    return await this.userDataRepository.find({
      where: {id: {inq: userIds}},
    });
  }

  async getSortedEntity(
    level: number,
    locationId: number,
  ): Promise<{id: number; locationData: string} | string> {
    const locations = await this.locationDataRepository.find();

    const locationMap = new Map<number, {id: number; locationData: string}>();
    const locationTwoMap = new Map<
      number,
      {id: number; locationData: string}
    >();
    const locationThreeMap = new Map<
      number,
      {id: number; locationData: string}
    >();

    for (const loc of locations) {
      locationMap.set(loc.id!, {id: loc.id!, locationData: loc.locationData});

      for (const locTwo of loc.locationTwos ?? []) {
        locationTwoMap.set(locTwo.id, {
          id: locTwo.id,
          locationData: locTwo.locationData,
        });

        for (const locThree of locTwo.locationThrees ?? []) {
          locationThreeMap.set(locThree.id, {
            id: locThree.id,
            locationData: locThree.locationData,
          });
        }
      }
    }

    if (level === 1) return locationMap.get(locationId) ?? 'No Data Found';
    if (level === 2) return locationTwoMap.get(locationId) ?? 'No Level 2 Data';
    if (level === 3)
      return locationThreeMap.get(locationId) ?? 'No Level 3 Data';

    return 'Invalid Level';
  }

  calculateReportingPeriods(
    startDate: string,
    endDate: string,
    frequency: number,
  ): string[][] {
    const periods: string[][] = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const periodGroup = [];
      for (let i = 0; i < frequency && currentDate <= end; i++) {
        periodGroup.push(
          `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`,
        );
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      periods.push(periodGroup);
    }

    return periods;
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
              entity: {type: 'object'},
            },
          },
        },
      },
    },
  })
  async generateReport(): Promise<any[]> {
    const assignments = await this.assignmentDataRepository.find();
    const submissions = await this.submissionDataRepository.find();

    const reportDataMap = new Map<number, any[]>();

    for (const assignment of assignments) {
      const expectedPeriods = this.calculateReportingPeriods(
        assignment.start_date,
        assignment.end_date,
        assignment.frequency,
      );

      const reporters = await this.getUsersByIds(assignment.reporter_ids);
      const reviewers = await this.getUsersByIds(assignment.reviewer_ids!);

      const reporterNames =
        reporters.map(user => ({
          id: user.id,
          name: user.information['empname'],
        })) || [];
      const reviewerNames =
        reviewers.map(user => ({
          id: user.id,
          name: user.information['empname'],
        })) || [];

      const entity = await this.getSortedEntity(
        assignment.level,
        assignment.locationId,
      );

      for (const periodGroup of expectedPeriods) {
        const submission = submissions.find(
          sub =>
            sub.dcfId === assignment.dcfId &&
            sub.locationId === assignment.locationId,
        );

        const status = this.getSubmissionStatus(submission);

        const reportItem = {
          dcfId: assignment.dcfId,
          reporting_period: periodGroup,
          status: status,
          reporter: reporterNames,
          reviewer: reviewerNames,
          entity: entity,
        };

        if (reportDataMap.has(assignment.dcfId)) {
          const existingData = reportDataMap.get(assignment.dcfId)!;

          existingData.push(reportItem);
        } else {
          reportDataMap.set(assignment.dcfId, [reportItem]);
        }
      }
    }

    return Array.from(reportDataMap.values()).flat();
  }
}
