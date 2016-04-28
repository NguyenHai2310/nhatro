FactoryGirl.define do
  factory :region do
    province ""
    # is_home {[true, false].sample}

    after(:build) do |region|
      region.addresses << FactoryGirl.build(:address, region: region)
    end
  end
end
