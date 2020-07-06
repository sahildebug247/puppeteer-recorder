import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { ConfigService } from '@nestjs/config';
@Injectable()
class AppService {
  private browser: Browser;
  constructor(private configService: ConfigService) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    console.log({ nodeEnv });
    puppeteer
      .launch({
        headless: false,
        defaultViewport: null,
        args: [
          '--enable-usermedia-screen-capturing',
          '--allow-http-screen-capture',
          '--auto-select-desktop-capture-source=pickme',
          '--enable-experimental-web-platform-features',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--use-gl=egl',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--start-maximized',
        ],
      })
      .then((browser) => {
        this.browser = browser;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  public async record(timeout: number, url: string) {
    const page: Page = await this.browser.newPage();
    console.log({ url, timeout });
    page.setViewport({
      height: 1920,
      width: 1080,
    });
    await page.goto(url);

    page.waitFor(2000);

    try {
      await page.evaluate(async () => {
        document.title = 'pickme';

        console.log = async (message) => {
          const logUrl = `http://localhost:3002/api/v1/log`;
          fetch(logUrl + `?q=${message}`, { method: 'GET' });
        };

        // @ts-ignore
        const stream = await navigator.mediaDevices.getDisplayMedia({
          audio: false,
          video: true,
        });
        // @ts-ignore
        const recorder = new MediaRecorder(stream, {
          videoBitsPerSecond: 5000000,
          ignoreMutedMedia: true,
          mimeType: 'video/webm',
        });
        var chunks = [];
        recorder.ondataavailable = (event) => {
          console.log(`Recieved event size = ${event.data.size}`);
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          var superBuffer = new Blob(chunks, {
            type: 'video/webm',
          });
          console.log(`SuperBuffer Size = ${superBuffer.size}`);
        };

        recorder.start();
        setTimeout(() => {
          recorder.stop();
          console.log(`Stopping Recording`);
        }, 10000);
      });

      console.log(`Initialized window navigator success`);
    } catch (e) {
      console.log(`Exception occurred with initialization ${e}`);
    }

    // .catch(function (error) {
    //   console.log({ error });
    //   throw new Error('TimeoutBrows');
    // });
    // await record({
    //   browser: null,
    //   page: null,
    //   fps: 60,
    //   output: 'output.webm',
    //   frames: 60 * 5,
    //   prepare: function () {},
    //   render: function () {},
    // });

    // await page.close();
  }
  catch(e) {
    console.log({ e });
  }
}

export default AppService;
