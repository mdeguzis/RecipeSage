import { Component } from "@angular/core";
import { NavController } from "@ionic/angular";
import * as Sentry from "@sentry/browser";

import { RouteMap, UtilService } from "~/services/util.service";
import { TRPCService } from "../../../services/trpc.service";
import type { JobSummary } from "@recipesage/prisma";

export const getJobFailureI18n = (importJob: JobSummary) => {
  switch (importJob.resultCode) {
    case 5: {
      return "pages.import.jobs.status.fail.badFile";
    }
    default: {
      return "pages.import.jobs.status.fail.unknown";
    }
  }
};

const JOB_POLL_INTERVAL_MS = 7500;

type ImportFormat =
  | "jsonld"
  | "pepperplate"
  | "livingcookbook"
  | "paprika"
  | "cookmate"
  | "recipekeeper"
  | "textfiles"
  | "urls"
  | "csv";

@Component({
  selector: "page-import",
  templateUrl: "import.page.html",
  styleUrls: ["import.page.scss"],
})
export class ImportPage {
  defaultBackHref: string = RouteMap.SettingsPage.getPath();

  /**
   * We show this many historical jobs
   */
  showJobs = 5;
  importJobs: JobSummary[] = [];
  jobPollInterval?: NodeJS.Timeout;

  constructor(
    private navCtrl: NavController,
    private trpcService: TRPCService,
    private utilService: UtilService,
  ) {}

  ionViewWillEnter() {
    this.setupJobStatusPoll();
  }

  ionViewWillLeave() {
    clearInterval(this.jobPollInterval);
  }

  setupJobStatusPoll() {
    if (this.jobPollInterval) clearInterval(this.jobPollInterval);
    this.load();

    this.jobPollInterval = setInterval(() => {
      this.load();
    }, JOB_POLL_INTERVAL_MS);
  }

  async load() {
    const response = await this.trpcService.handle(
      this.trpcService.trpc.jobs.getJobs.query(),
    );
    if (response) {
      this.importJobs = response
        .sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime();
        })
        .filter((job) => {
          return job.type === "IMPORT";
        });
    } else {
      clearInterval(this.jobPollInterval);
    }
  }

  getRunningJob() {
    return this.importJobs.filter((job) => job.status === "RUN").at(0);
  }

  formatItemCreationDate(plainTextDate: string | Date) {
    return this.utilService.formatDate(plainTextDate, {
      now: false,
      times: true,
    });
  }

  showMoreJobs() {
    this.showJobs += 5;
  }

  startImport(format: ImportFormat) {
    switch (format) {
      case "jsonld": {
        this.navCtrl.navigateForward(RouteMap.ImportJSONLDPage.getPath());
        break;
      }
      case "pepperplate": {
        this.navCtrl.navigateForward(RouteMap.ImportPepperplatePage.getPath());
        break;
      }
      case "livingcookbook": {
        this.navCtrl.navigateForward(
          RouteMap.ImportLivingcookbookPage.getPath(),
        );
        break;
      }
      case "paprika": {
        this.navCtrl.navigateForward(RouteMap.ImportPaprikaPage.getPath());
        break;
      }
      case "cookmate": {
        this.navCtrl.navigateForward(RouteMap.ImportCookmatePage.getPath());
        break;
      }
      case "recipekeeper": {
        this.navCtrl.navigateForward(RouteMap.ImportRecipeKeeperPage.getPath());
        break;
      }
      case "textfiles": {
        this.navCtrl.navigateForward(RouteMap.ImportTextfilesPage.getPath());
        break;
      }
      case "urls": {
        this.navCtrl.navigateForward(RouteMap.ImportUrlsPage.getPath());
        break;
      }
      case "csv": {
        this.navCtrl.navigateForward(RouteMap.ImportCSVPage.getPath());
        break;
      }
    }
  }

  getJobFailureI18n(job: JobSummary) {
    return getJobFailureI18n(job);
  }

  getImportJobPath(job: JobSummary) {
    const importLabels = job.meta?.importLabels;
    if (!importLabels?.length || job.status !== "SUCCESS") return null;

    return RouteMap.HomePage.getPath("main", {
      selectedLabels: importLabels,
    });
  }

  goToImportPath(job: JobSummary) {
    const importPath = this.getImportJobPath(job);
    if (!importPath) return;

    this.navCtrl.navigateForward(importPath);
  }

  getJobTitleI18n(job: JobSummary) {
    const importType = job.meta?.importType;
    if (!importType) return "pages.import.jobs.job";

    switch (importType) {
      case "fdxz":
      case "lcb": {
        return "pages.import.livingCookbook";
      }
      case "pepperplate": {
        return "pages.import.pepperplate";
      }
      case "paprika": {
        return "pages.import.paprika";
      }
      case "jsonld": {
        return "pages.import.jsonld";
      }
      case "recipekeeper": {
        return "pages.import.recipeKeeper";
      }
      case "cookmate": {
        return "pages.import.cookmate";
      }
      case "textFiles": {
        return "pages.import.textFiles";
      }
      case "urls": {
        return "pages.import.urls";
      }
      case "csv": {
        return "pages.import.csv";
      }
      default: {
        Sentry.captureMessage("Job ImportType not handled", {
          extra: {
            importType,
          },
        });
        return "pages.import.jobs.job";
      }
    }
  }
}
