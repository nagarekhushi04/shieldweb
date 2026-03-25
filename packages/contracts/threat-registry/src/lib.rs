#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ThreatEntry {
    pub url_hash: String,
    pub reporter: Address,
    pub timestamp: u64,
    pub threat_type: String,
    pub severity: u32,
    pub verified: bool,
    pub upvotes: u32,
    pub downvotes: u32,
    pub active: bool,
}

#[contracttype]
pub enum DataKey {
    Threat(String),
    ThreatList,
    Admin,
    ReporterCount(Address),
    TotalThreats,
}

#[contract]
pub struct ThreatRegistryContract;

#[contractimpl]
impl ThreatRegistryContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::ThreatList, &Vec::<String>::new(&env));
        env.storage().instance().set(&DataKey::TotalThreats, &0u32);
    }

    pub fn report_threat(
        env: Env,
        reporter: Address,
        url_hash: String,
        threat_type: String,
        severity: u32,
    ) {
        reporter.require_auth();

        let mut threat: ThreatEntry = env
            .storage()
            .persistent()
            .get(&DataKey::Threat(url_hash.clone()))
            .unwrap_or(ThreatEntry {
                url_hash: url_hash.clone(),
                reporter: reporter.clone(),
                timestamp: env.ledger().timestamp(),
                threat_type,
                severity,
                verified: false,
                upvotes: 0,
                downvotes: 0,
                active: true,
            });

        if env.storage().persistent().has(&DataKey::Threat(url_hash.clone())) {
            threat.upvotes += 1;
        } else {
            let mut list: Vec<String> = env
                .storage()
                .instance()
                .get(&DataKey::ThreatList)
                .unwrap();
            list.push_back(url_hash.clone());
            env.storage().instance().set(&DataKey::ThreatList, &list);
            
            let mut total: u32 = env.storage().instance().get(&DataKey::TotalThreats).unwrap();
            total += 1;
            env.storage().instance().set(&DataKey::TotalThreats, &total);
        }

        env.storage().persistent().set(&DataKey::Threat(url_hash.clone()), &threat);

        let mut reporter_count: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::ReporterCount(reporter.clone()))
            .unwrap_or(0);
        reporter_count += 1;
        env.storage().persistent().set(&DataKey::ReporterCount(reporter), &reporter_count);
    }

    pub fn verify_threat(env: Env, admin: Address, url_hash: String) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Not admin");
        }

        let mut threat: ThreatEntry = env.storage().persistent().get(&DataKey::Threat(url_hash.clone())).unwrap();
        threat.verified = true;
        env.storage().persistent().set(&DataKey::Threat(url_hash), &threat);
    }

    pub fn check_threat(env: Env, url_hash: String) -> Option<ThreatEntry> {
        env.storage().persistent().get(&DataKey::Threat(url_hash))
    }

    pub fn get_all_threats(env: Env) -> Vec<String> {
        env.storage().instance().get(&DataKey::ThreatList).unwrap()
    }

    pub fn get_total_threats(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::TotalThreats).unwrap()
    }

    pub fn get_reporter_count(env: Env, reporter: Address) -> u32 {
        env.storage().persistent().get(&DataKey::ReporterCount(reporter)).unwrap_or(0)
    }

    pub fn remove_threat(env: Env, admin: Address, url_hash: String) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Not admin");
        }

        let mut threat: ThreatEntry = env.storage().persistent().get(&DataKey::Threat(url_hash.clone())).unwrap();
        threat.active = false;
        env.storage().persistent().set(&DataKey::Threat(url_hash), &threat);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ThreatRegistryContract);
        let client = ThreatRegistryContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let reporter = Address::generate(&env);

        env.mock_all_auths();

        // 1. Initialize
        client.initialize(&admin);

        // 2. Report Threat
        let url_hash = String::from_str(&env, "hashxyz123");
        let threat_type = String::from_str(&env, "phishing");
        client.report_threat(&reporter, &url_hash, &threat_type, &10);

        // 3. Check Threat
        let threat = client.check_threat(&url_hash).unwrap();
        assert_eq!(threat.url_hash, url_hash);
        assert_eq!(threat.verified, false);
        assert_eq!(threat.threat_type, threat_type);
        assert_eq!(threat.severity, 10);

        // 4. Verify Threat
        client.verify_threat(&admin, &url_hash);
        let updated_threat = client.check_threat(&url_hash).unwrap();
        assert_eq!(updated_threat.verified, true);
    }
}
