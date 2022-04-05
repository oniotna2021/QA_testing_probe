pipeline {
  agent any
  options {
    timeout(time: 15, unit: "MINUTES")
  }
  stages {
    stage("Initialize") {
      steps {
        initialize_function()
      }
    }
    stage('SonarQube analysis') {
      steps {
        sonar_scanner()
      }
    }
    stage("Quality Gate") {
      steps {
          timeout(time: 1, unit: 'HOURS') {
            sonar_await_result()
          }
      }
    }
    stage("Build") {
      steps {
        build_function()
      }
    }
    stage("Test") {
      steps {
        test_function()
      }
    }
    stage("Deploy") {
      when {
        anyOf {
          branch "release"
          branch "master"
        }
      }
      steps {
        deploy_function()
      }
    }
  }
}

def initialize_function() {
  // - PLEASE ONLY MODIFY VALUES IN THIS FUNCTION!!!
  sh "echo Hello"
  env.APP_NAME = "FRONT-MYBODYTECH"
  env.SONAR_PROJECT_KEY_BASE = "BodyTech-Dev_"
  env.SONAR_PROJECTKEY = "${SONAR_PROJECT_KEY_BASE}${APP_NAME}"
  env.SONAR_SCANNER_NAME = "sonarqubePOC"
  env.QUALITY_GATE = "true"
}

def test_function() {
  sh "echo Hello!!!"
}

def build_function() {
  sh "echo Hello!!!"
}

def deploy_function() {
  sh "echo Hello"
}

def sonar_scanner() {
  def scannerHome = tool "${SONAR_SCANNER_NAME}";
    withSonarQubeEnv("${SONAR_SCANNER_NAME}") {
    sh "${scannerHome}/bin/sonar-scanner -D sonar.branch.name=${BRANCH_NAME} -D sonar.projectKey=${SONAR_PROJECTKEY}"
    }
}

def sonar_await_result() {
  if (env.QUALITY_GATE == "true") {
    waitForQualityGate abortPipeline: true
  }
}
